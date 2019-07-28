const WorldState = require("../state/WorldState");
const collisions = require("../utils/collisions");
const CharFactory = require("../state/CharFactory");
const LoopActionsQ = require("./LoopActionsQ");
const DemoWish = require("./wishes/DemoWish");

const VERSION = "0.0.5";
console.log("ServerCore v:" + VERSION);

class ServerCore {
    constructor() {
        this.worldState = new WorldState();
        this.unitLibrary = this.worldState.getUnitLibrary();
        this.lastLoopTime = null;
        this.wishes = [];
        this.loopActionsQ = new LoopActionsQ();
        this.broadcastHandler = null;
    }

    load() {
        return this.worldState.loadSave()
        .then(() => this._instantiateWishes(this.worldState.getUnits()))
        .then(() => this._startGameLoop())
            ;
    }

    broadcast(data, session) {
        data.v = VERSION;
        this.broadcastHandler(data, session);
    }

    handleBroadcast(callback) {
        this.broadcastHandler = callback;
    }

    pushActionRequest(action, session) {
        console.log(`< received:${action.v} ${action.name} from ${session.accountId}`);
        const actionName = action.name;
        if (!actionName) {
            throw new Error("ServerCore: actionName must be defined");
        }
        // TODO validate session
        if (actionName === "sysLoadUser") {
            this.broadcast({ name: "sysLoadWorld", worldState: { state: this.worldState.state } }, session);
        }
        if (actionName === "seeTheWorld") {
            let controlledUnit = this.worldState.findUnit({accountId: session.accountId});
            if (!controlledUnit) {
                controlledUnit = CharFactory.initEmptyCharacter({accountId: session.accountId, name: `Account#${session.accountId}`});
                this.worldState.addDynamicUnit(controlledUnit);
                this.broadcast({ name: "sysAddDynamicUnit", unit: controlledUnit });
            };
            setTimeout(() => {
                this.broadcast({ name: "takeControl", unitId: controlledUnit.id }, session);
            }, 500); // TODO batch updates
        }
        if (actionName === "moveUnit") {
            const { unitId, uPoint } = action;
            this.loopActionsQ.setAction({ unitId, name: actionName, uPoint });
        }
        if (actionName === "useAbility" && action.slot === 1) {
            const sourceUnit = this.worldState.findUnit({id: action.sourceUnit.id});
            this.loopActionsQ.setAction({ unitId: sourceUnit.id, name: "hit", sourceUnit });
        }
        if (actionName === "interactWith") {
            const { sourceUnit, targetUnit } = action;
            const serverTargetUnit = this.unitLibrary.findUnit({ id: targetUnit.id });
            this.broadcast({ name: "say", unitId: sourceUnit.id, message: `Hello ${serverTargetUnit.name}` });
            // reply
            if (serverTargetUnit.id === 2) {
                setTimeout(() => {
                    let reply = "Hi man";
                    if (Math.random() > 0.4) {
                        reply = "Hello";
                    }
                    if (Math.random() > 0.6) {
                        reply = "What do you want?";
                    }
                    if (Math.random() > 0.8) {
                        reply = "Yeah...";
                    }
                    if (Math.random() > 0.9) {
                        reply = "Leave me alone!";
                    }
                    if (serverTargetUnit.state.isDead) {
                        reply = "...";
                        setTimeout(() => {
                            this.broadcast({ name: "say", unitId: sourceUnit.id, message: "Oh dear..." });
                        }, 3000);
                    }
                    this.broadcast({ name: "say", unitId: serverTargetUnit.id, message: reply });
                }, 1500);
            }
            if (serverTargetUnit.id === 17) {
                setTimeout(() => {
                    this.broadcast({ name: "say", unitId: serverTargetUnit.id, message: "..." });
                }, 1500);
                setTimeout(() => {
                    this.broadcast({ name: "say", unitId: sourceUnit.id, message: "A'm talking to lake... Need more NPCs here!" });
                }, 5000);
            }
        }
    }

    _startGameLoop() {
        this.lastLoopTime = (new Date()).getTime();
        setInterval(() => {
            this._doLoopTick();
        }, 50);
    }

    _doLoopTick() {
        const now = (new Date()).getTime();
        const delta = now - this.lastLoopTime;
        this.lastLoopTime = now;
        this.wishes.forEach((wish) => {
            const actions = wish.getActions(delta, this.unitLibrary);
            this.loopActionsQ.mergeActions(actions);
        });
        this._processActionsAndFlush(this.loopActionsQ);
        this.wishes = this.wishes.filter(wish => !wish.isCompleted());
    }

    _processActionsAndFlush() {
        for (let unitId in this.loopActionsQ.q) {
            const unitActions = this.loopActionsQ.q[unitId];
            for (let actionName in unitActions) {
                this._changeStateByAction(unitActions[actionName]);
                this.broadcast(unitActions[actionName]);
            }
        }
        this.loopActionsQ.flush();
    }

    _changeStateByAction(action) {
        if (action.name === "moveUnit") {
            this.worldState.updUnitById(action.unitId, action.uPoint);
        }
        if (action.name === "hit") {
            const sourceUnit = this.worldState.findUnit({id: action.sourceUnit.id});
            const hitArea = collisions.calcWeaponHitArea(sourceUnit);
            const hitedUnits = collisions.findUnitsInArea(this.worldState.getHitableUnits(), hitArea);
            // this.broadcast({ name: "debugArea", ...hitArea });

            hitedUnits.forEach((targetUnit) => {
                if (targetUnit.id === sourceUnit.id) {
                    return;
                }
                if (targetUnit.state.isDead) {
                    return;
                }
                const newHp = targetUnit.state.hp - 40;
                const isDead = newHp <= 0;
                const newState = Object.assign(targetUnit.state, { hp: newHp, isDead });
                const updTargetUnit = this.worldState.updUnitById(targetUnit.id, { state: newState });
                this.broadcast({ name: "damage", sourceUnit, targetUnit: updTargetUnit });
                this.broadcast({ name: "say", unitId: updTargetUnit.id, message: isDead ? "Oh, need to rest." : (newHp > 50 ? "Careful!" : "Stop It!") });

                if (isDead && targetUnit.id === 1) {
                    setTimeout(() => this.broadcast({ name: "say", unitId: updTargetUnit.id, message: "F5..." }), 22000);
                }
            });
        }
    }

    _instantiateWishes(units){
        for (let i in units) {
            const unit = units[i];
            if (!unit.wishes) {
                continue;
            }
            unit.wishes.forEach((wish) => {
                this.wishes.push(
                    new DemoWish(unit, wish)
                );
            });
        }
    }

    initDisconnectedAction(){
        return { name: "sysDisconnected" };
    }
}

module.exports = ServerCore;

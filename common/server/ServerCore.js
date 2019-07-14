const WorldState = require("../state/WorldState");
const collisions = require("../utils/collisions");
const LoopActionsQ = require("./LoopActionsQ");
const DemoWish = require("./wishes/DemoWish");

class ServerCore {
    constructor() {
        this.worldState = new WorldState();
        this.unitLibrary = this.worldState.getUnitLibrary();
        this.connections = [];
        this.lastLoopTime = null;
        this.wishes = [];
        this.loopActionsQ = new LoopActionsQ();
    }

    load() {
        return this.worldState.loadSave()
        .then(() => this._instantiateWishes(this.worldState.getUnits()))
        .then(() => this.startGameLoop())
            ;
    }

    startGameLoop() {
        this.lastLoopTime = (new Date()).getTime();
        setInterval(() => {
            this.loop();
        }, 20);
    }

    loop() {
        const now = (new Date()).getTime();
        const delta = now - this.lastLoopTime;
        this.wishes.forEach((wish) => {
            const actions = wish.getActions(delta, this.unitLibrary);
            this.loopActionsQ.mergeActions(actions);
        });
        this.wishes = this.wishes.filter(wish => !wish.isCompleted());
        this.processActionsAndFlush(this.loopActionsQ);
        this.lastLoopTime = now;
    }

    processActionsAndFlush() {
        for (let unitId in this.loopActionsQ.q) {
            const unitActions = this.loopActionsQ.q[unitId];
            for (let actionName in unitActions) {
                this.changeStateByAction(unitActions[actionName]);
                this.broadcast({}, unitActions[actionName]);
            }
        }
        this.loopActionsQ.flush();
    }

    changeStateByAction(action) {
        if (action.name === "moveUnit") {
            this.worldState.updUnitById(action.unitId, action.uPoint);
        }
        if (action.name === "hit") {
            const sourceUnit = this.worldState.findUnit({id: action.sourceUnit.id});
            const hitArea = collisions.calcWeaponHitArea(sourceUnit);
            const hitedUnits = collisions.findUnitsInArea(this.worldState.getHitableUnits(), hitArea);
            // this.broadcast({}, { name: "debugArea", ...hitArea });

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
                this.broadcast({}, { name: "damage", sourceUnit, targetUnit: updTargetUnit });
                this.broadcast({}, { name: "say", unitId: updTargetUnit.id, message: isDead ? "Oh, need to rest." : (newHp > 50 ? "Careful!" : "Stop It!") });

                if (isDead && targetUnit.id === 1) {
                    setTimeout(() => this.broadcast({}, { name: "say", unitId: updTargetUnit.id, message: "F5..." }), 22000);
                }
            });
        }
    }

    pushActionRequest(session, action) {
        const actionName = action.name;
        if (!actionName) {
            throw new Error("ServerCore: actionName must be defined");
        }
        // TODO validate session
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
            this.broadcast(session, { name: "say", unitId: sourceUnit.id, message: `Hello ${serverTargetUnit.name}` });
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
                            this.broadcast(session, { name: "say", unitId: sourceUnit.id, message: "Oh dear..." });
                        }, 3000);
                    }
                    this.broadcast(session, { name: "say", unitId: serverTargetUnit.id, message: reply });
                }, 1500);
            }
            if (serverTargetUnit.id === 17) {
                setTimeout(() => {
                    this.broadcast(session, { name: "say", unitId: serverTargetUnit.id, message: "..." });
                }, 1500);
                setTimeout(() => {
                    this.broadcast(session, { name: "say", unitId: sourceUnit.id, message: "A'm talking to lake... Need more NPCs here!" });
                }, 5000);
            }
        }
    }

    // TODO tmp
    connect(serverConnection) {
        this.connections.push(serverConnection);
    }

    broadcast(session, data) {
        this.connections.forEach(c => {
            c.onMessageFromServerCallback && c.onMessageFromServerCallback(session, data);
        });
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
}

module.exports = ServerCore;

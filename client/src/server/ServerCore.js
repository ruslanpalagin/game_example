import WorldState from "src/state/WorldState.js";
import collisions from "src/common/collisions.js";
import LoopActionsQ from "src/server/LoopActionsQ.js";
import DemoWish from "src/server/wishes/DemoWish.js";

export default class ServerCore {
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
            this.broadcast(session, { name: "hit", sourceUnit });
            this.broadcast(session, { name: "debugArea", ...collisions.calcWeaponHitBox(sourceUnit) });
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
                    this.broadcast(session, { name: "say", unitId: serverTargetUnit.id, message: reply });
                }, 1500);
            }
            if (serverTargetUnit.id === 17) {
                setTimeout(() => {
                    this.broadcast(session, { name: "say", unitId: serverTargetUnit.id, message: "..." });
                }, 1500);
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
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
        // .then(() => this.runAI())
        .then(() => this.startGameLoop())
            ;
    }

    startGameLoop() {
        this.lastLoopTime = (new Date()).getTime();
        setInterval(() => {
            this.loop();
        }, 50);
    }

    loop() {
        const now = (new Date()).getTime();
        const delta = now - this.lastLoopTime;
        this.wishes.forEach((wish) => {
            const actions = wish.getActions(delta, this.unitLibrary);
            this.loopActionsQ.mergeActions(actions);
        });
        this.processActionsAndFlush(this.loopActionsQ);
        this.lastLoopTime = now;
    }

    processActionsAndFlush() {
        for (let unitId in this.loopActionsQ.q) {
            const unitActions = this.loopActionsQ.q[unitId];
            for (let actionName in unitActions) {
                this.changeState(unitActions[actionName]);
                this.broadcast({}, unitActions[actionName]);
            }
        }
        this.loopActionsQ.flush();
    }

    changeState(action) {
        if (action.name === "moveUnit") {
            this.worldState.updUnitById(action.unitId, action.uPoint);
        }
    }

    runAI() {
        const char2 = this.worldState.findUnit({id: 2});
        const interval = setInterval(() => {
            const updatedUnit = this.worldState.updUnitById(char2.id, {
                position: { x: char2.position.x - 0.2, y: char2.position.y + 0.4 }
            });
            this.broadcast({}, "moveUnit", updatedUnit);
        }, 50);
        setTimeout(() => {
            clearInterval(interval);
            const updatedUnit = this.worldState.updUnitById(char2.id, {
                rotation: 0
            });
            this.broadcast({}, "moveUnit", updatedUnit);
        }, 55000);
        setInterval(() => {
            this.broadcast({}, "hit", { source: char2 });
            this.broadcast({}, "debugArea", collisions.calcWeaponHitBox(char2));
        }, 1000);
    }

    pushActionRequest(session, action, data) {

    }

    pushActionRequestOld(session, action, data) {
        if (action === "moveUnit") {
            const { unit, position, rotation } = data;
            const diff = {};
            if (position) {
                diff.position = position;
            }
            if (rotation) {
                diff.rotation = rotation;
            }
            const updatedUnit = this.worldState.updUnitById(unit.id, diff);
            this.broadcast(session, "moveUnit", updatedUnit);
        }
        if (action === "interactWith") {
            const { source, target } = data;
            const targetUnit = this.unitLibrary.findUnit({ id: target.unitId });
            this.broadcast(session, "say", { unitId: source.unitId, message: `Hello ${targetUnit.name}` });
            if (target.unitId === 2) {
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
                    this.broadcast(session, "say", { unitId: target.unitId, message: reply });
                }, 1500);
            }
            if (target.unitId === 17) {
                setTimeout(() => {
                    this.broadcast(session, "say", { unitId: target.unitId, message: "..." });
                }, 1500);
            }
        }
        if (action === "useAbility" && data.slot === 1) {
            const sourceUnit = this.worldState.findUnit({id: data.source.id});
            this.broadcast(session, "hit", { source: sourceUnit });
            this.broadcast(session, "debugArea", collisions.calcWeaponHitBox(sourceUnit));
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
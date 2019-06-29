import WorldState from "src/state/WorldState.js";
import collisions from "src/common/collisions.js";

export default class ServerCore {
    constructor() {
        this.worldState = new WorldState();
        this.unitLibrary = this.worldState.getUnitLibrary();
        this.connections = [];
    }

    load() {
        return this.worldState.loadSave()
        .then(() => this.runAI());
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
    }

    pushActionRequest(session, action, data) {
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

    broadcast(session, action, data) {
        this.connections.forEach(c => {
            c.onMessageFromServerCallback && c.onMessageFromServerCallback(session, action, data);
        });
    }
}
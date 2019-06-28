import WorldState from "src/state/WorldState.js";

export default class ServerCore {
    constructor() {
        this.worldState = new WorldState();
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
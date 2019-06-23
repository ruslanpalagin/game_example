import ServerCore from "src/server/ServerCore.js";

export default class ServerConnection {
    constructor() {
        this.onMessageFromServerCallback = null;
        this.serverCore = new ServerCore(); // TODO tmp
        window.serverCore = this.serverCore;
    }

    connect() {
        return this.serverCore.load()
        .then(() => {
            this.serverCore.connect(this);
        }); // tmp;
    }

    loadWorldState() {
        return Promise.resolve(this.serverCore.worldState.state);
    }

    toServer(session, action, data) {
        // console.log("session, action, data", session, action, data);
        this.serverCore.pushActionRequest(session, action, data);
    }

    onMessageFromServer(callback) {
        this.onMessageFromServerCallback = callback;
    }
}
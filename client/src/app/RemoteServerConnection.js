import qs from "qs";

export default class RemoteServerConnection {
    constructor() {
        this.onMessageFromServerCallback = null;
        this.socket = null;
        this.pingTimeId = "ping";
    }

    ping() {
        console.time(this.pingTimeId);
        this.send({ name: "ping" });
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
    }

    // TODO handle reconnect
    connect(session) {
        // const socket = this.socket = new WebSocket("ws://35.240.39.143:8080/game");
        const socket = this.socket = new WebSocket("ws://localhost:8080/game?" + qs.stringify(session));

        return new Promise((resolve) => {
            socket.onopen = () => {
                console.log("ws open");
                resolve();
                this.ping();
            };

            socket.onclose = (event) => {
                if (event.wasClean) {
                    console.warn('Соединение закрыто чисто');
                } else {
                    console.warn('Обрыв соединения'); // например, "убит" процесс сервера
                }
                console.warn('Код: ' + event.code + ' причина: ' + event.reason);
            };

            socket.onmessage = (event) => {
                console.log("WS c event data", event.data);
                const data = JSON.parse(event.data);
                this.onMessageFromServerCallback(data);
                data.name === "pong" && console.timeEnd(this.pingTimeId);
            };

            socket.onerror = (error) => {
                console.warn("Ошибка " + error.message);
            };
        });
    }

    toServer(action) {
        this.send(action);
    }

    onMessageFromServer(callback) {
        this.onMessageFromServerCallback = callback;
    }
}
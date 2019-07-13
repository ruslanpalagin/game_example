export default class RemoveServerConnection {
    constructor() {
        this.onMessageFromServerCallback = null;
        this.socket = null;
    }

    connect() {
        const socket = this.socket = new WebSocket("ws://35.240.39.143:8080/game");

        return new Promise((resolve) => {
            socket.onopen = function() {
                console.log("ws open");
                resolve();
            };

            socket.onclose = function(event) {
                if (event.wasClean) {
                    console.warn('Соединение закрыто чисто');
                } else {
                    console.warn('Обрыв соединения'); // например, "убит" процесс сервера
                }
                console.warn('Код: ' + event.code + ' причина: ' + event.reason);
            };

            socket.onmessage = function(event) {
                console.log("WS c event", event);
                this.onMessageFromServerCallback(JSON.parse(event.data));
            };

            socket.onerror = function(error) {
                console.warn("Ошибка " + error.message);
            };
        });
    }

    loadWorldState() {
        return Promise.resolve({
            units: [
                { id: 21, viewSkin: "road", position: {x: 0, y: 0} },
                {
                    id: 1, viewSkin: "char", name: "", accountId: 1, position: { x: 0, y: 0 }, rotation: 1.57, isInteractive: true,
                    canBeDamaged: true,
                    state: { hp: 100, isDead: false },
                    stats: { maxHp: 100 },
                },
            ]
        });
    }

    toServer(session, action) {
        // todo
    }

    onMessageFromServer(callback) {
        this.onMessageFromServerCallback = callback;
    }
}
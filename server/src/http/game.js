const route = require('koa-route');
const ws = require('../instances/ws');
const ServerCore = require('../../../common/server/ServerCore');

const serverCore = new ServerCore();

module.exports = route.all('/game', function (ctx) {
    ctx.websocket.on('message', (action) => {
        ws.socket = ctx.websocket;
        action = JSON.parse(action);
        console.log("message.data", action);
        action.name === "ping" && ws.socket.send(JSON.stringify({ name: "pong" }));
    });
});

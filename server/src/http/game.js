const route = require('koa-route');
// const ws = require('../instances/ws');
const ServerCore = require('../../../core/server/ServerCore');
const serverCore = new ServerCore();
const qs = require("qs");

const clients = {};

serverCore.load();
serverCore.handleBroadcast((data, sendingQuery = {}) => {
    if (sendingQuery.accountId) {
        doSend(clients[sendingQuery.accountId], data);
        return;
    }
    Object.keys(clients).forEach((accountId) => {
        doSend(clients[accountId], data);
    });
});

module.exports = route.all('/game', function (ctx, next) {
    const params = qs.parse(ctx.query);
    // wrote session into ctx. ctx is the same across ws frames
    const sessionAccountId = parseInt(params.accountId, 10);
    clients[sessionAccountId] = ctx.websocket;
    clients[sessionAccountId].sessionAccountId = sessionAccountId;

    ctx.websocket.on('message', (action) => {
        action = JSON.parse(action);
        serverCore.pushActionRequest(action, { accountId: ctx.websocket.sessionAccountId });
    });

    return next(ctx);
});

// TODO refactor - move to service
const doSend = (client, action) => {
    console.log(`> ${action.v}:sending to: ${client.sessionAccountId}: ${action.name}`);
    try {
        client.send(JSON.stringify(action)); // TODO handle connect/disconnect/hash-search
    } catch (e) {
        console.log(e.toString());
    }
};


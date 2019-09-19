const route = require('koa-route');
// const ws = require('../instances/ws');
const debug = require('debug')('ws');
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
    const sessionAccountId = parseInt(params.accountId, 10);
    disconnectIfConnected(clients, sessionAccountId);
    // wrote session into ctx. ctx is the same across ws frames
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
    debug(`> ${action.v}:sending to: ${client.sessionAccountId}: ${action.name}`);
    try {
        client.send(JSON.stringify(action));
    } catch (e) {
        console.log(e.toString());
    }
};

const disconnectIfConnected = (clients, accountId) => {
    if (clients[accountId]) {
        doSend(clients[accountId], serverCore.initDisconnectedAction());
    }
};

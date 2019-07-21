const route = require('koa-route');
// const ws = require('../instances/ws');
const ServerCore = require('../../../common/server/ServerCore');
const serverCore = new ServerCore();
const qs = require("qs");

const clients = [];

module.exports = route.all('/game', function (ctx, next) {
    const params = qs.parse(ctx.query);
    // wrote session into ctx. ctx is the same across ws frames
    ctx.websocket.sessionAccountId = parseInt(params.accountId, 10);
    clients.push(ctx.websocket);
    serverCore.load();
    serverCore.handleBroadcast((data, session) => {
        clients.forEach((client) => {
            // skip not relevant clients if session specified
            if (session && session.accountId !== client.sessionAccountId) {
                return;
            }
            console.log(`sending to: ${client.sessionAccountId}: ${data.name}`);
            client.send(JSON.stringify(data));
        });
    });

    ctx.websocket.on('message', (action) => {
        action = JSON.parse(action);
        serverCore.pushActionRequest(action, { accountId: ctx.websocket.sessionAccountId });
    });

    return next(ctx);
});

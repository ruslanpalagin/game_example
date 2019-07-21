const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');
const ws = require('./instances/ws');
const game = require('./http/game');

// init
const app = websockify(new Koa());

// WS
// app.ws.use(function(ctx, next) {
//     ws.socket = ctx.websocket;
//     return next(ctx);
// });
app.ws.use(game);

// http
app.use(route.all('/', function (ctx) {
    ctx.body = "koa ws V0.0.2";
}));

app.listen(8080);
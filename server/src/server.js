const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');
const ws = require('./instances/ws');
const game = require('./http/game');

// init
const app = websockify(new Koa());

// WS
app.ws.use(game);

// http
app.use(route.all('/', function (ctx) {
    ctx.body = "koa ws V0.0.2";
}));

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function(ctx, next) {
    // ws.socket = ctx.websocket;
    console.log("mw");
    // return `next` to pass the context (ctx) on to the next ws middleware
    return next(ctx);
});

app.listen(8080);
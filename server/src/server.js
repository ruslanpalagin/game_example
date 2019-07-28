const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');
// const ws = require('./instances/ws');
const game = require('./http/game');

const VERSION = "0.0.5";
const versionMsg = "HTTP Server v:" + VERSION;
console.log(versionMsg);

// init
const app = websockify(new Koa());

// WS
app.ws.use(game);

// http
app.use(route.all('/', function (ctx) {
    ctx.body = versionMsg;
}));

app.listen(8080);
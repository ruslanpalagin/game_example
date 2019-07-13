const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');

// const homeAction = require("./http/home");

const app = websockify(new Koa());
let gws = null;

// Using routes
app.use(route.all('/', function (ctx) {
    ctx.body = "koa ws V0.0.2";
    if (gws) {
        gws.send(JSON.stringify({ name: "say", unitId: 1, message: "Connected!" }));
    } else {
        console.log("gws is empty");
    }
}));

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function(ctx, next) {
    // return `next` to pass the context (ctx) on to the next ws middleware
    return next(ctx);
});

// Using routes
app.ws.use(route.all('/game', function (ctx) {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    // ctx.websocket.send('Hello World');
    gws = ctx.websocket;
    // console.log("ctx.websocket", ctx.websocket);
    console.log("set gws");
    ctx.websocket.on('message', (action) => {
        // do something with the message from client
        action = JSON.parse(action);
        console.log("message.data", action);
        action.name === "ping" && gws.send(JSON.stringify({ name: "pong" }));
    });
}));

app.listen(8080);
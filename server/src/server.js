const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');

// const homeAction = require("./http/home");

const app = websockify(new Koa());
let gws = null;

// Using routes
app.use(route.all('/', function (ctx) {
    ctx.body = "koa ws V1";
    if (gws) {
        gws.send('web rq');
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
app.ws.use(route.all('/wstest', function (ctx) {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    ctx.websocket.send('Hello World');
    gws = ctx.websocket;
    console.log("set gws", gws);
    ctx.websocket.on('message', function(message) {
        // do something with the message from client
        console.log(message);
    });
}));

app.listen(process.env.PORT || 8080);

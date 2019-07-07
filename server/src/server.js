const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

const homeAction = require("./http/home");

router.get("/", homeAction);

app.use(router.routes());
app.listen(8081);

const Server = require('ws').Server;
const port = process.env.WS_PORT || 8080;
const ws = new Server({port: port});

ws.on('connection', function(w){
    w.on('message', function(msg){
        console.log('message from client', msg);
    });
    w.on('close', function() {
        console.log('closing connection');
    });

    ws.send('something');
});

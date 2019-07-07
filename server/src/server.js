const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

const homeAction = require("./http/home");

router.get("/", homeAction);

app.use(router.routes());
app.listen(8080);


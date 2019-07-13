const route = require('koa-route');
const Koa = require('koa');
const websockify = require('koa-websocket');
const knext = require('knext');

// const homeAction = require("./http/home");

const app = websockify(new Koa());
let gws = null;

// Using routes
app.use(route.all('/', function (ctx) {
    // ctx.body = "koa ws V1";
    const posts = await knext("posts").last(10);
    const postsHtml = posts.map(post => `<div>${post.title}<>`).join();
    ctx.body = `
    <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <script>window.dataLayer = window.dataLayer || [];</script> <link rel="icon" type="image/png" href="/assets/images/awara_admin_favicon.png"/> <link rel="stylesheet" type="text/css" href="/assets/stylesheets/adminFonts.min.css"/> <script type="text/javascript">
            window.Configuration = {
                APP_FONTS: "/assets/stylesheets/awaraFonts.min.css",
                APP_BUNDLE: "/assets/javascripts/adminApp.js",
                APP_CSS: "/assets/stylesheets/adminApp.min.css",
                API_BASE: "https://qa-api.awarasleep.com",
                WSS_BASE: "wss://qa-api.awarasleep.com"
                
                    ,ENV: "dev"
                
            };${postsHtml}
        </script> <script defer src="/assets/javascripts/configuration.js" type="text/javascript"></script> <noscript>Please enable javascript.</noscript> </head> <body> <div id="app"></div> </body> </html>
    `;
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
    console.log("ctx.websocket", ctx.websocket);
    gws = ctx.websocket;
    // console.log("set gws", gws);
    ctx.websocket.on('message', function(message) {
        // do something with the message from client
        console.log(message);
    });
}));

app.listen(8080);
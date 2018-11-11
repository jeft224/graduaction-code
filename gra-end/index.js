'user strict'

const  Koa = require('koa');
const config = require('./config');
const  http = require('http');
const KoaBody = require('koa-body'); //post 解析
const helmet = require('koa-helmet'); // 安全相关
const mongodb = require('./mongodb');
const router = require('./route');
const Interceptor = require('./middlewares/intercepotor');
const Logger = require('./middlewares/logs/log')

const  app = new Koa();

//数据连接
 mongodb.connect();

// logger 日志 edit -> 将logger日志改成log4js日志
app.use(async (ctx, next) => {
    const start = Date.now();
    try {
        await next();
        const ms = Date.now() - start;
        Logger.logResponse(ctx,ms);
        console.log(`${ctx.method} ${ctx.url} - ${ms}`);
    }catch (error) {
        const ms = Date.now() - start;
        Logger.logError(ctx,error,ms);
    }

});

app.use(Interceptor);


app.use(KoaBody({
    jsoinLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb',
   multipart: true
}));
app.use(helmet());

app.use(require('koa-static')(__dirname + '/public'))

// 404 500
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.log(error)
        ctx.body = { code: 0, message: '服务器内部错误',error:error }
    }
    if (ctx.status === 404 || ctx.status === 405) ctx.body = { code: 0, message: '无效的api请求'}
})

//路由管理
app.use(router.routes()).use(router.allowedMethods())




// app.use((ctx,next)=>{
//     ctx.body = 'hello world!!!!!'
// })

//app.listen(8000)
http.createServer(app.callback()).listen(config.APP.PORT,()=>{
    console.log(` Koa-project Run！port at ${config.APP.PORT}`)
})
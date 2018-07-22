const authIsVerified = require('../utils/auth');
module.exports = async (ctx, next) => {

    //拦截器
    // const origin = ctx.request.headers.origin || '';
    // if (origin.includes('localhost')) {
    //     ctx.set('Access-Control-Allow-Origin', origin);
    // };

    ctx.set({
        'Access-Control-Allow-Origin':"*",
        'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
        'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
        'Access-Control-Max-Age': '1728000',
        'Content-Type': 'application/json;charset=utf-8',
        'X-Powered-By': 'vue-mall 1.0.0'
    });

    // OPTIONS
    if (ctx.request.method == 'OPTIONS') {
        ctx.status = 200;
        return false;
    };

    // 排除auth的post请求 && 评论的post请求 && like请求 && hero post
    const isLogin = Object.is(ctx.request.url, '/api/login') && Object.is(ctx.request.method, 'POST');
    if (isLogin) {
        await next();
        return false;
    };

    // 拦截所有的非get请求
    // if (!authIsVerified(ctx) && !Object.is(ctx.request.method, 'GET')) {
    //     ctx.throw(401, { code: -2, message: '身份验证失败！' })
    //     return false;
    // };

    await next();

}
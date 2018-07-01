/* auth验证方法 */

const config = require('../config');
const jwt = require('jsonwebtoken');

//验证Auth

const authToken =(ctx)=>{
    console.log(ctx.headers+":"+ctx.headers.authorization)
    if (ctx.headers && ctx.headers.authorization) {
        const parts = ctx.headers.authorization.split(' ')
        if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
            return parts[1]
        }
    }
    return false
}

//验证权限

const authIsVerified=(ctx)=>{
    const token = authToken(ctx)
    ///const token = ctx.headers['Authorization'];
    // console.log(token)
    if (token) {
        try {
            const decodedToken = jwt.verify(token, config.User.jwtTokenSecret)
            // ctx.user={
            //     username:decodedToken.username,
            //     userId:decodedToken.userId
            // }
            if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
                return decodedToken;
            }
        } catch (err) {
            console.log('token verify fail: ', err)
        }
    }
    return null
}

module.exports = authIsVerified;
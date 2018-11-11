'use strict'

const log4js = require('log4js');

const log_config = require('./log_config');
// 加载文件
log4js.configure(log_config);

let log = {};

const errorLogger = log4js.getLogger('errorLogger');
const resLogger = log4js.getLogger('resLogger');

log.logError =  (ctx,error,resTime) => {
    if(ctx && error){
        errorLogger.error()
    }
}

log.logResponse = (ctx,resTime) => {
    if(ctx){
        resLogger.info()
    }
}
module.exports = log;
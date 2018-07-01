const crypto = require('crypto')
const config = require('../config')
const mongoose = require('../mongodb').mongoose
require('../utils/date')

const nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss')

const  UserSchema = new mongoose.Schema({
    // 名字
    username: {
        unique:true,
        type: String,
        default: config.User.defaultUsername
    },
    // 密码
    password: {
        type: String,
        default: crypto.createHash('md5').update(config.User.defaultPassword).digest('hex')
    },
    //头像
    avatar:{
        type:String,
        default:config.User.defaultAvatar
    },
    //电话号码
    phone: { type: String, default: '' },
    //性别
    sex:{type:String,default:''},
    //启用 1，禁用0
    status:{type:Boolean,default:1},
    // 出生日期
    birthday:{type:String,default:''},
    //创建时间
    createTime:{type:String,default:nowTime}
})


const User =mongoose.model('User',UserSchema);

module.exports = User;
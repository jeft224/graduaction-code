const crypto = require('crypto')
const config = require('../config')
const mongoose = require('../mongodb').mongoose


const  AdminSchema = new mongoose.Schema({
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
    phone: { type: String, default: ''},
    //性别
    sex:{type:String,default:''},
    // 出生日期
    birthday:{type:Date,default:''},
    //创建时间
    createTime:{type:Date,default:Date.now()}
})


const Admin =mongoose.model('Admin',AdminSchema);

module.exports = Admin;
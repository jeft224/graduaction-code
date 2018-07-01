const User = require("../model/User")
const config = require("../config")

const  jwt = require('jsonwebtoken') //token
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');

const {
    handleError,
    handleSuccess
} = require("../utils/handle")
const authIsVerified = require('../utils/auth')

//MD5加密
const md5Decode = (pwd)=>{
    return crypto.createHash("md5").update(pwd).digest("hex");
}

class UserController{
    //用户登录
    static async userLogin(ctx){
        const {username,password} =ctx.request.body;
        const user = await User.findOne({username}).catch((err)=>{console.log(err);ctx.throw(500,'服务器内部错误')});
        if(user){
            if(user.password === md5Decode(password)){
                if(!user.status){
                    handleError({ ctx, message: "账户被禁用！" })
                }else{
                    const token = jwt.sign({
                        username: user.username,
                        userId:user._id,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
                    }, config.User.jwtTokenSecret)
                    handleSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, message: "登陆成功" })
                }
            }else {
                handleError({ ctx, message: "密码错误!" })
            }
        }else {
            handleError({ ctx, message: "账户不存在" })
        }
    }

    //用户注册
    static async userCreate(ctx){
        const { username, password } = ctx.request.body
        const res = await User.findOne({username}).catch((err)=>ctx.throw(500,'服务器内部错误'));
        if (res && res.length !== 0) {
            handleError({ ctx, message: '已存在相同用户名' })
            return false
        }
        const pwd = md5Decode(password);
        const user = await new User({ username, password:pwd })
            .save()
            .catch(err => handleError({ ctx, message: err }))

        if(user){
            handleSuccess({ctx,message:"注册成功"});
        }
    }

    //查询当前用户
    static async queryUserById(ctx){
        const detoken = authIsVerified(ctx);
        const user = await User.findOne({_id:detoken.userId}).catch((err)=>{ctx.throw(500,'服务器内部错误')});
        if(user){
            handleSuccess({ ctx,result:user, message: '查询用户成功！' })
        }else{
            handleError({ctx,message:'查询用户失败！'})
        }
    }

    //编辑用户
    static async userEdit(ctx){
        const {username, sex,birthday,phone,_id} = ctx.request.body

        const user = await User.update({_id:_id},{username,sex,birthday,phone})
            .catch(err => handleError({ctx, message: err}))

        if (user) {
            handleSuccess({ctx, message: "编辑用户成功"});
        }
    }

    //用户查询(后台管理)
    static async userQuery(ctx){
        const page = ctx.params.page;
        const pageSize = 10;
        const total = await User.find({}).count().catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        const users = await User.find({},{},{ skip: (page - 1) * pageSize,
            limit: pageSize}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })

        if(users){
            handleSuccess({ ctx,result:{users,total}, message: '查询用户成功！' })
        }else{
            handleError({ctx,message:'加载用户失败！'})
        }
    }

    //根据id查询用户(后台管理)
    static async userQueryById(ctx){
        const _id = ctx.params.id;
        const user = await User.findOne({_id}).catch((err)=>{ctx.throw(500,'服务器内部错误')});
        if(user){
            handleSuccess({ ctx,result:{user}, message: '查询用户成功！' })
        }else{
            handleError({ctx,message:'查询用户失败！'})
        }
    }

    //用户启用和禁用功能
    static async userUpdate(ctx){
        const {_id,status} = ctx.request.body
        console.log(status)
        const tmp = await User.findOne({_id:_id})
            .catch(err => handleError({ctx, message: err}))
        if(tmp.status===status){
            if(tmp.status){
                handleSuccess({ctx, message: "用户已启用"});
            }else{
                handleSuccess({ctx, message: "用户已禁用"});
            }
        }else{
            const user = await User.update({_id:_id},{status:status})
                .catch(err => handleError({ctx, message: err}))
            if(user){
                if(status){
                    handleSuccess({ctx, message: "用户启用"});
                }else{
                    handleSuccess({ctx, message: "用户禁用"});
                }
            }
        }
    }
    //头像上传
    static async userUpload(ctx) {
        const _id = ctx.request.body.fields._id;
        let files = ctx.request.body.files;

        let filespath;
        for (var item in files) {

            var tmpath = files[item]['path'];
            var tmparr = files[item]['name'].split('.');
            var ext = '.' + tmparr[tmparr.length - 1];
            var newpath = path.join('public/upload', parseInt(Math.random() * 100) + Date.parse(new Date()).toString() + ext);

            filespath = newpath.replace(/\\/g, "/").substring(7);


            var stream = fs.createWriteStream(newpath);//创建一个可写流

            fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
            //异步回调需要将其包装厂promise
            await new Promise((rel, rej) => {
                stream.on('finish', function (err) {
                    if (err) {
                        rej(err);
                    }
                    rel()
                });
            });
            const user = await User.update({_id: _id}, {avatar: filespath})
                .catch(err => {
                    console.log(err)
                })

            if (user) {
                handleSuccess({ctx, result: {filespath}, message: "头像上传成功"});
            }
        }
    }
    //密码修改
    static async updatePwd(ctx){
        const {userId, newPwd,oldPwd} = ctx.request.body;
        let oldpwd = md5Decode(oldPwd);
        const userPwd = await User.findOne({_id:userId})
            .catch((err)=> handleError({ctx, message: err}))
        if(userPwd.password !==oldpwd){
            handleError({ctx, message: "原密码输入错误"});
            return ;
        }

        const pwd = md5Decode(newPwd);
        const user = await User.update({_id:userId},{password:pwd})
            .catch(err => handleError({ctx, message: err}))

        if (user) {
            handleSuccess({ctx, message: "修改密码成功"});
        }
    }
    // 删除用户
    static async deleteUser(ctx){
        const {_id} = ctx.request.body;
        const user = User.remove({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(user){
            handleSuccess({ ctx, message: '删除用户成功！' })
        }else{
            handleError({ctx,message:'删除用户失败！'})
        }
    }
}

module.exports = UserController;




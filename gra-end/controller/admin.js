const Admin = require("../model/Admin")
const config = require("../config")

const  jwt = require('jsonwebtoken') //token
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');

const {
    handleError,
    handleSuccess
} = require("../utils/handle")

//MD5加密
const md5Decode = (pwd)=>{
    return crypto.createHash("md5").update(pwd).digest("hex");
}

class AdminController {
    //管理员登录
    static async AdminLogin(ctx) {
        const {username, password} = ctx.request.body;
        const admin = await Admin.findOne({username}).catch((err) => {
            console.log(err);
            ctx.throw(500, '服务器内部错误')
        });
        if (admin) {
            if (admin.password === md5Decode(password)) {
                const token = jwt.sign({
                    username: admin.username,
                    password: admin.password,
                    userId: admin._id,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
                }, config.User.jwtTokenSecret)
                handleSuccess({
                    ctx,
                    result: {token, lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)},
                    message: "登陆成功"
                })
            } else {
                handleError({ctx, message: "密码错误!"})
            }
        } else {
            handleError({ctx, message: "账户不存在"})
        }
    }

    //管理员更新

    static async AdminUpdate(ctx) {
        const {username, sex,birthday,phone,_id} = ctx.request.body

        // const birth = birthday.format("yyyy-MM-dd")
        const user = await Admin.update({_id:_id},{username,sex,birthday,phone})
            .catch(err => handleError({ctx, message: err}))

        if (user) {
            handleSuccess({ctx, message: "管理员信息更新成功"});
        }
    }

    //管理员查询

    static async AdminQuery(ctx){
        const _id = ctx.params.id
        const admin = await Admin.findOne({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(admin){
            handleSuccess({ ctx,result:admin, message: '查询管理员成功' })
        }else{
            handleError({ctx,message:'查询管理员失败'})
        }
    }

    //管理员根据id查询头像
    static async queryAdminById(ctx){
        const detoken = authIsVerified(ctx);
        const admin = await Admin.findOne({_id:detoken.userId}).catch((err)=>{ctx.throw(500,'服务器内部错误')});
        if(admin){
            handleSuccess({ ctx,result:admin, message: '查询用户成功！' })
        }else{
            handleError({ctx,message:'查询用户失败！'})
        }
    }

    //头像上传
    static async AdminUpload(ctx){

        const _id = ctx.request.body.fields._id;
        let files =  ctx.request.body.files;

        let filespath ;
        for(var item in files) {

            var tmpath = files[item]['path'];
            console.log(files[item]['name']);
            var tmparr = files[item]['name'].split('.');
            var ext = '.' + tmparr[tmparr.length - 1];
            var newpath = path.join('public/upload', parseInt(Math.random() * 100) + Date.parse(new Date()).toString() + ext);
            console.log(tmpath);
            console.log(newpath.replace(/\\/g,"/").substring(7));
            filespath = newpath.replace(/\\/g,"/").substring(7)


            var stream = fs.createWriteStream(newpath);//创建一个可写流

            fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
            //异步回调需要将其包装厂promise
             await new Promise((rel,rej)=>{
                stream.on('finish', function(err) {
                    if(err){
                        rej(err);
                    }
                    rel()
                });
            });
            const admin = await Admin.update({_id:_id},{avatar:filespath})
                .catch(err => {console.log(err)})

            if (admin) {
                handleSuccess({ctx, result:{filespath}, message: "注册成功"});
            }
            // await  stream.on('finish', async function() {
            //     const admin = await Admin.update({_id:_id},{avatar:filespath})
            //         .catch(err => {console.log(err)})
            //
            //     if (admin) {
            //         handleSuccess({ctx, result:{filespath}, message: "注册成功"});
            //     }
            //
            // });


        }
    }
    //密码修改
    static async updateAdminPwd(ctx){
        const {userId, newPwd,oldPwd} = ctx.request.body;
        let oldpwd = md5Decode(oldPwd);
        const adminPwd = await Admin.findOne({_id:userId})
            .catch((err)=> handleError({ctx, message: err}))
        if(adminPwd.password !==oldpwd){
            handleError({ctx, message: "原密码输入错误"});
            return ;
        }
        const pwd = md5Decode(newPwd);
        const admin = await Admin.update({_id:userId},{password:pwd})
            .catch(err => handleError({ctx, message: err}))

        if (admin) {
            handleSuccess({ctx, message: "修改密码成功"});
        }
    }
}


module.exports = AdminController;
const Address = require('../model/Address');

const {
    handleError,
    handleSuccess
} = require("../utils/handle")
const authIsVerified = require('../utils/auth')

class AddressController{
    // 添加地址
    static async addAddress(ctx){
        const detoken = authIsVerified(ctx.request);
        const {receiverName,receiverPhone,receiverAddress,isDefault} = ctx.request.body;

        if(isDefault){
            const arss = await Address.update({userId:detoken.userId},{isDefault:false}).where({isDefault:true})
                .catch((err)=>ctx.throw(err,'服务器内部错误'))
        }

        const address = await new Address({receiverName,receiverPhone,receiverAddress,userId:detoken.userId,isDefault})
            .save().catch((err)=>ctx.throw(err,'服务器内部错误'))
        if(address){
            handleSuccess({ctx,message:"添加收货信息成功！"})
        }else{
            handleError({ctx,message:"添加收货信息失败！"})
        }
    }
    // 编辑地址
    static async updateAddress(ctx){
        const detoken = authIsVerified(ctx.request);
        const {receiverName,receiverPhone,receiverAddress,isDefault,_id} = ctx.request.body;
        if(isDefault){
            const arss = await Address.update({userId:detoken.userId},{isDefault:false}).where({isDefault:true})
                .catch((err)=>ctx.throw(err,'服务器内部错误'))
        }
        const address = await Address.update({_id},{receiverName,receiverPhone,receiverAddress,isDefault}).catch((err)=>ctx.throw(err,'服务器内部错误'))
        if(address){
            handleSuccess({ctx,message:"编辑收货人信息成功！"})
        }else{
            handleError({ctx,message:"编辑收货人信息失败！"})
        }
    }
    // 删除地址
    static async deleteAddress(ctx){
        const {_id}= ctx.request.body;
        const address = await Address.remove({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(address){
            handleSuccess({ ctx,message: '删除收货人信息成功！' })
        }else{
            handleError({ctx,message:'删除收货人信息失败！'})
        }
    }
    //根据userId查询地址
    static async queryAddressByUserId(ctx){
        const detoken = authIsVerified(ctx.request);
        const address = await Address.find({userId:detoken.userId}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(address){
            handleSuccess({ ctx,result:address, message: '查询用户收货信息成功' })
        }else{
            handleError({ctx,message:'查询用户收货信息失败'})
        }
    }
    //根据id查询地址
    static async queryAddressById(ctx){
        const _id = ctx.params.id;
        const address = await Address.findOne({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(address){
            handleSuccess({ ctx,result:address, message: '查询用户收货信息成功' })
        }else{
            handleError({ctx,message:'查询用户收货信息失败'})
        }
    }
}


module.exports = AddressController;

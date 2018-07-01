const Cart = require('../model/Cart');
const Goods = require('../model/Goods')
const {
    handleError,
    handleSuccess
} = require("../utils/handle")
const authIsVerified = require('../utils/auth')

class CartController {
    //添加购物车
    static async AddCart(ctx){
        const {productId,productNum} =ctx.request.body;
        const detoken = authIsVerified(ctx.request);
        const userId =detoken.userId;
        const carts = await Cart.find({userId,productId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
        const gd = await Goods.findOne({productId});
        if(gd.stock===0){
            handleError({ctx,message:`商品${gd.productName}已经售完`});
            return false
        }
        if(productNum>gd.stock){
            handleError({ctx,message:`商品${gd.productName}库存不足`});
            return false
        }
        if(carts.length!==0){
            const cart = carts.map((item)=>{
                item.productNum += productNum;
                return item;
            })
            const ucart = await Cart.update({_id:cart[0]._id},{productNum:cart[0].productNum}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            const allcart = await Cart.find({userId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            if(ucart){
                handleSuccess({ctx,result:allcart,message:"添加到购物车成功！"});
            }else{
                handleError({ctx,message:"添加到购物车失败！"});
            }
        }else{
            const good = await Goods.findOne({productId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            const Usercart = new Cart({
                productId: good.productId,
                productImg: good.productImageSmall[0],
                productName: good.productName,
                checked: 1,
                productNum: productNum,
                productPrice: good.salePrice,
                userId:userId
            })
            const UCart = await Usercart.save().catch((err)=>ctx.throw(err,'服务器内部错误'));
            const tmpcart = await Cart.find({userId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            if(UCart){
                handleSuccess({ctx,result:tmpcart,message:"添加到购物车成功！"});
            }
        }
    }
    //删除购物车
    static async deleteCart(ctx){
        const productId=  ctx.request.body.productId;
        // console.log(productId)
        const cart = await Cart.remove({productId}).catch((err)=>{console.log(err);ctx.throw(err,'服务器内部错误')})
        if(cart){
            handleSuccess({ctx,message:"删除商品成功！"});
        }
    }
    //查询购物车
    static async queryCart(ctx){
        const detoken = authIsVerified(ctx.request);
        if(!detoken){
            handleSuccess({ ctx})
            return false;
        }
        // console.log(detoken.userId)
        const cart = await Cart.find({userId:detoken.userId}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(cart){
            handleSuccess({ ctx,result:cart, message: '查询购物车成功' })
        }else{
            handleError({ctx,message:'查询购物车失败'})
        }
    }

    //编辑购物车
    static async editCart(ctx){
        const {productId,productNum,checked} = ctx.request.body;
        const detoken = authIsVerified(ctx.request);
        // console.log(detoken.userId)
        const cart = await Cart.update({productId,userId:detoken.userId},{productNum,checked})
            .catch((err)=>{ctx.throw(err,'服务器内部错误')});
        if(cart){
            handleSuccess({ctx,message:"修改成功！"});
        }
    }

    //全选
    static async editCheckAll(ctx){

    }
}

module.exports = CartController
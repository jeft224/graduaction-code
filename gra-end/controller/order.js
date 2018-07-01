const Order = require("../model/Order")
const Address = require("../model/Address")
const Cart = require("../model/Cart")
const Goods = require('../model/Goods');
const mongoose = require('../mongodb').mongoose;

const {
    handleError,
    handleSuccess
} = require("../utils/handle")

const authIsVerified = require('../utils/auth')


class OrderController {
    //生成订单
    static async postOrder(ctx){
        const {addressId, orderTotal, productId, productNum} = ctx.request.body;
        const detoken = authIsVerified(ctx.request);

        if (addressId && orderTotal) {
            const address = await Address.findOne({userId:detoken.userId,_id:addressId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            const cartList = await Cart.find({userId:detoken.userId}).catch((err)=>ctx.throw(err,'服务器内部错误'))
            let goodsList =[];

            // 生成订单号
            let platform = '618';
            let r1 = Math.floor(Math.random() * 10);
            let r2 = Math.floor(Math.random() * 10);
            let sysDate = new Date().Format('yyyyMMddhhmmss');
            let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
            let orderId = platform + r1 + sysDate + r2;

            let order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: 1,
                userID:detoken.userId,
                createDate: createDate
            };

            if (productId && productNum) {
                let goodsDoc = await Goods.findOne({productId})

                let item = {
                    productId: goodsDoc.productId,
                    productImg: goodsDoc.productImageSmall[0],
                    productName: goodsDoc.productName,
                    checked: '1',
                    productNum,
                    productPrice: goodsDoc.salePrice
                }
                if(goodsDoc.stock===0){
                    handleError({ctx,message:`${goodsDoc.productName}已经售完`});
                    return false
                }
                if(productNum>goodsDoc.stock){
                    handleError({ctx,message:`${goodsDoc.productName}库存不足`});
                    return false
                }
                let nums = goodsDoc.stock-productNum;
                await Goods.update({productId},{stock:nums})
                goodsList.push(item)
                const orders =await new Order(order).save().catch((err)=>ctx.throw(err,'服务器内部错误'));
                if(orders){
                    handleSuccess({ctx,message:"订单提交成功"});
                }

            } else {
                // 获取用户购物车的购买商品
                cartList.forEach((item) => {
                    if (item.checked === '1') {
                        goodsList.push(item);
                    }
                });

                goodsList.every(async (item)=>{
                    const gd = await Goods.findOne({productId:item.productId});
                    let num ;
                    if(gd.stock===0){
                        handleError({ctx,message:`${item.productName}已经售完`});
                        return false
                    }
                    if(item.productNum>gd.stock){
                        handleError({ctx,message:`${item.productName}库存不足`});
                        return false
                    }
                    num = gd.stock-item.productNum;
                    await Goods.update({productId:item.productId},{stock:num})
                    return true;
                })
                const cart = await Cart.remove({userId:detoken.userId})
                    .catch((err)=>ctx.throw(err,'服务器内部错误'));

                const tmp =await new Order(order).save().catch((err)=>ctx.throw(err,'服务器内部错误'));
                if(tmp){
                    handleSuccess({ctx,message:"订单提交成功"});
                }
            }
        }
        else {
            handleSuccess({ctx,message:"订单提交成功"});
        }

    }
    //根据用户id查询订单
    static async queryOrderById(ctx){

        const detoken = authIsVerified(ctx);
        // console.log(ctx.user.userId)
        // const userID = "5aa645c8135ee023c01f2c62";

        const order = await Order.find({userID:detoken.userId}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(order){
            handleSuccess({ ctx,result:order, message: '查询订单成功' })
        }else{
            handleError({ctx,message:'查询订单失败'})
        }
    }
    //查询所有订单
    static async queryAllOrder(ctx){
        const page = ctx.params.page;
        const pageSize = 10;
        const total = await Order.find({}).count().catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        const orders = await Order.find({},{},{ skip: (page - 1) * pageSize,
            limit: pageSize}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })

        // allOrder.sort(-1)
        if(orders){
            handleSuccess({ ctx,result:{orders,total}, message: '查询全部订单成功' })
        }else{
            handleError({ctx,message:'查询全部订单失败'})
        }
    }

    //删除订单
    static async deleteOrder(ctx){
        const {_id}= ctx.request.body;
        const order = await Order.remove({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(order){
            handleSuccess({ ctx, result:order,message: '删除订单成功' })
        }else{
            handleError({ctx,message:'删除订单失败'})
        }
    }
    //根据订单id查询订单
    static async queryOrderByOrderId(ctx){
        const _id = ctx.params.id;

        const order = await Order.findOne({_id}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(order){
            handleSuccess({ ctx, result:order,message: '查询订单成功' })
        }else{
            handleError({ctx,message:'查询订单失败'})
        }
    }
}
module.exports = OrderController

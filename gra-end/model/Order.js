const mongoose = require('../mongodb').mongoose;
require('../utils/date')

const nowTime = new Date().Format('yyyy-MM-dd hh:mm:ss');

const OrderSchema = new mongoose.Schema({
    //订单号
    orderId:{type: String, required: true},
    //订单状态 1 支付 2 未支付
    orderStatus:{type:Number,default:1},
    //用户id
    //userID:{type: mongoose.Schema.Types.ObjectId},
    userID:{type: String},
    //地址信息
    // addressInfo:{type:String,required:true},
    addressInfo:{type:mongoose.Schema.Types.Mixed,required:true},
    // 商品列表
    goodsList:{type:Array},

    orderTotal:{type:Number},
    //订单时间
    orderTime:{type:String,default:nowTime}
})

const Order = mongoose.model('Order',OrderSchema);

module.exports = Order;
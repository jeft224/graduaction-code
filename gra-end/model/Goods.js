const mongoose = require('../mongodb').mongoose;

const GoodsSchema = new mongoose.Schema({
    productId: String,
    salePrice: Number,
    productName: String,
    productImageSmall: Array,
    stock: Number,
    sub_title: String,
    limit_num: String,
    createTime:String,
    tag:String,
    hot:Boolean,
    dr:{type:Number,default:0}
})

const Goods = mongoose.model('Goods',GoodsSchema);

module.exports = Goods;
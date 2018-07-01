const mongoose = require('../mongodb').mongoose;

const  AddressSchema = new mongoose.Schema({
    // 收货人姓名
    receiverName:{
        type:String
    },
    // 收货人电话
    receiverPhone:{
        type:String
    },
    // 收货人地址
    receiverAddress:{
        type:String
    },
    // 用户id
    userId:{
        type:String
    },
    //设置地址默认
    isDefault:{
        type:Boolean
    }
})

const Address = mongoose.model('Address',AddressSchema);

module.exports = Address;
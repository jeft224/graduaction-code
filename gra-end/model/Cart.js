const mongoose = require('../mongodb').mongoose;

const CartSchema = new mongoose.Schema({
    productId: String,
    productImg: String,
    productName: String,
    checked: String,
    productNum: Number,
    productPrice: Number,
    userId: String,
})

const Cart = mongoose.model('Cart',CartSchema);

module.exports = Cart;
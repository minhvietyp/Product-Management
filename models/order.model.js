const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    userInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String,
            thumbnail: String,
            name: String,
            price: Number,
            stock: Number,
            quantity: Number,
            totalPrice: Number,
            discountPercentage: Number
        }
    ],
    totalPrice: Number,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String
}, {
    timestamps: true,
    collection: 'orders'
});

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
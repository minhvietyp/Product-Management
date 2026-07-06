const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    product_category_id: {
        type: String,
        default: ""
    },
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    createdBy: {
        account_id: String,
        createdAt: { type: Date, default: Date.now },
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date,
        }
    ],
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    // deletedAt: Date,
    deletedBy: {
        account_id: String,
        deletedAt: Date,
    }
}, {
    timestamps: true,
    collection: 'products'
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;

const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
const Product = require("../../models/product.model");
const helperProducts = require("../../helpers/products");



// [GET] /
module.exports.index = async (req, res) => {

    //Lay ra san pham noi bat 
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(5);

    const newProductsFeatured = helperProducts.priceNewProducts(productsFeatured);

    //lay ra san pham moi nhat
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(5);

    const newProductsNew = helperProducts.priceNewProducts(productsNew);

    
    
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}
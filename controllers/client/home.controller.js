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

    const newProducts = helperProducts.priceNewProducts(productsFeatured);
    
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    });
}
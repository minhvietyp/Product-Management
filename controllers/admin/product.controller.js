const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");


// [GET] /admin/products

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

   // Tim kiem theo keyword
    const objectSearch = SearchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);

    res.render("admin/pages/product/index", {
        pageTitle: "Product Management",
        filterStatus: filterStatus,
        products: products,
        keyword: objectSearch.keyword
    });
}

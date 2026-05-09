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
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination

    let objectPagination = {
        limitItem: 4,
        currentPage: 1
    };

    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    // End Pagination



    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.render("admin/pages/product/index", {
        pageTitle: "Product Management",
        filterStatus: filterStatus,
        products: products,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

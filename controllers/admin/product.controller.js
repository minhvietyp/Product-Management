const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");


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
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            limitItem: 4,
            currentPage: 1
        },
        req.query,
        countProducts
    );

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

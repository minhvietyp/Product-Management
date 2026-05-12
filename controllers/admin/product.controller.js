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

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });


    res.redirect("back");
};

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            // req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            // req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { 
                deleted : true, 
                deletedAt : new Date()
            });
            // req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        default:
            break;
    }

    res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });

    await Product.updateOne({ _id: id }, { 
        deleted: true, 
        deletedAt: new Date(),
        // deletedBy: req.user.id
    });
    res.redirect("back");
}
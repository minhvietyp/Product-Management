const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination");
const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const filterStatus = filterStatusHelper(req.query);

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = SearchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const countRecords = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        { limitItem: 10, currentPage: 1 },
        req.query,
        countRecords
    );

    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    const records = await ProductCategory.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    const newRecords = createTreeHelper.tree(records);

    // console.log(newRecords);


    res.render("admin/pages/product-category/index", {
        pageTitle: "Product Category Management",
        records: newRecords,
        pagination: objectPagination,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái danh mục thành công!");
    res.redirect("back");
}

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật thành công ${ids.length} danh mục`);
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật thành công ${ids.length} danh mục`);
            break;
        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Xóa thành công ${ids.length} danh mục`);
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                const newPosition = parseInt(position);
                await ProductCategory.updateOne({ _id: id }, { position: newPosition });
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} danh mục`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/product-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });

    req.flash("success", "Xóa danh mục sản phẩm thành công!");
    res.redirect("back");
}


// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/create", {
        pageTitle: "Create Product Category",
        records: newRecords
    });
}


//  Create Post
module.exports.createPost = async (req, res) => {
    if (req.body.position === "") {
        const count = await ProductCategory.count();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/product-category`);

}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await ProductCategory.findOne(find);
        if (!record) {
            throw new Error("Category not found");
        }

        const records = await ProductCategory.find({
            deleted: false,
            status: "active",
            _id: { $ne: req.params.id }
        }).sort({ position: "desc" });

        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/product-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy danh mục sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
    if (req.body.position === "") {
        const count = await ProductCategory.count();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    try {
        await ProductCategory.updateOne({
            _id: req.params.id
        }, req.body);

        req.flash("success", "Cập nhật danh mục sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật danh mục sản phẩm thất bại");
    }

    res.redirect("back");
}

// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await ProductCategory.findOne(find);
        if (!record) {
            throw new Error("Category not found");
        }

        res.render("admin/pages/product-category/detail", {
            pageTitle: record.title,
            record: record
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy danh mục sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}

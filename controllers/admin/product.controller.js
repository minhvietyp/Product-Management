const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");


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

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }



    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .lean({ virtuals: true });   // plain JS objects — safe to add extra properties

    // Enrich each product with creator / last-updater full names
    for (const product of products) {
        // Creator info — guard against missing createdBy (legacy products)
        if (product.createdBy && product.createdBy.account_id) {
            const user = await Account.findOne({ _id: product.createdBy.account_id }).lean();
            if (user) {
                product.createdByFullName = user.fullName;
            }
        }

        // Last updater info — fix typo (updateBy → updatedBy) + guard against empty array
        if (product.updatedBy && product.updatedBy.length > 0) {
            const lastUpdate = product.updatedBy[product.updatedBy.length - 1];
            const userUpdated = await Account.findOne({ _id: lastUpdate.account_id }).lean();
            if (userUpdated) {
                product.updatedByFullName = userUpdated.fullName;
            }
        }
    }

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

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    }

    await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });

    req.flash("success", "Cập nhật trạng thái thành công!");


    res.redirect("back");
};

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                // deletedAt: new Date()
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                const newPosition = parseInt(position);
                await Product.updateOne({ _id: id }, { position: newPosition, $push: { updatedBy: updatedBy } });
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm`)
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
        // deletedAt: new Date(),
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });

    req.flash("success", "Xóa sản phẩm thành công!")
    res.redirect("back");
}


module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);


    res.render("admin/pages/product/create", {
        pageTitle: "Them moi san pham",
        records: newRecords,
    });
}

module.exports.createPost = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Vui long nhap thong tin san pham");
        res.redirect("back");
        return;
    }

    // if(req.body.length < 8){
    //     req.flash("error", "Vui long nhap thong tin san pham it nhat 8 ky tu");
    //     res.redirect("back");
    //     return;
    // }



    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if (req.body.position === "") {
        const countProducts = await Product.count();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id,
    };



    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);

}

// Edit product
//param truyen dong(vi du nhu id), con query dang sau dau hoi cham
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const records = await ProductCategory.find({
            deleted: false,
            status: "active",
            _id: { $ne: req.params.id }
        }).sort({ position: "desc" });

        const newRecords = createTreeHelper.tree(records);

        const product = await Product.findOne(find);
        if (!product) {
            throw new Error("Product not found");
        }

        res.render("admin/pages/product/edit", {
            pageTitle: "Sua san pham",
            product: product,
            records: newRecords,
        });
    } catch (error) {
        req.flash("error", "Khong tim thay san pham");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};


// Patch edit product
module.exports.editPatch = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if (req.body.position === "") {
        const countProducts = await Product.count();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
        req.body.thumbnail = `uploads/${req.file.filename}`;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }

        // req.body.updatedBy = updatedBy;

        await Product.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });

        req.flash("success", "Update san pham thanh cong");

    } catch (error) {
        req.flash("error", "Update san pham that bai");
    }


    res.redirect("back");

};


// Detail Product
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);
        if (!product) {
            throw new Error("Product not found");
        }

        res.render("admin/pages/product/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        req.flash("error", "Khong tim thay san pham");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};


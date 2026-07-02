const Role = require('../../models/role.model');
const SearchHelper = require("../../helpers/search");
const systemConfig = require('../../config/system');

// Thêm .index vào sau module.exports
module.exports.index = async (req, res) => { 
    let find = { deleted: false };
    
    const objectSearch = SearchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const records = await Role.find(find);
    
    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        records: records,
        keyword: objectSearch.keyword
    });
};

module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Thêm mới nhóm quyền"
    });
};

module.exports.createPost = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tên nhóm quyền!");
        res.redirect("back");
        return;
    }

    try {
        const record = new Role(req.body);
        await record.save();
        req.flash("success", "Tạo nhóm quyền mới thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);   
    } catch (error) {
        req.flash("error", "Tạo nhóm quyền thất bại.");
        res.redirect("back");
    }
};

module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const role = await Role.findOne(find);
        if (!role) {
            throw new Error("Role not found");
        }

        res.render("admin/pages/role/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            role: role
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy thông tin nhóm quyền này");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.editPatch = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Tiêu đề nhóm quyền không được bỏ trống!");
        res.redirect("back");
        return;
    }

    try {
        await Role.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật nhóm quyền thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật dữ liệu thất bại.");
    }

    res.redirect("back");
};

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const role = await Role.findOne(find);
        if (!role) {
            throw new Error("Role not found");
        }

        res.render("admin/pages/role/detail", {
            pageTitle: `Chi tiết: ${role.title}`,
            role: role
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy thông tin nhóm quyền cần tìm");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

// 
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });

        req.flash("success", "Xóa nhóm quyền thành công!");
    } catch (error) {
        req.flash("error", "Xóa dữ liệu nhóm quyền không thành công.");
    }
    
    res.redirect("back");
};

// GET /permissions
module.exports.permissions = async (req, res) => {
    try {
        const find = {
            deleted: false
        };

        const records = await Role.find(find);
        if (!records) {
            throw new Error("Roles not found");
        }

        res.render("admin/pages/role/permissions", {
            pageTitle: "Phân quyền",
            records: records
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy thông tin nhóm quyền cần tìm");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};


// Bổ sung vào cuối file controllers/admin/role.controller.js
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);

        for (const item of permissions) {
            await Role.updateOne(
                { _id: item.id },
                { permissions: item.permissions }
            );
        }

        req.flash("success", "Cập nhật phân quyền thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật phân quyền thất bại.");
    }

    res.redirect("back");
};
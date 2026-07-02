const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const SearchHelper = require("../../helpers/search");
const systemConfig = require('../../config/system');
const md5 = require('md5');

const prefixAdmin = `/${systemConfig.prefixAdmin}`;

module.exports.index = async (req, res) => {
    try {
        let find = { deleted: false };

        const objectSearch = SearchHelper(req.query);
        if (objectSearch.regex) {
            find.fullName = objectSearch.regex;
        }

        // Use .lean() to get plain JS objects — safe to add arbitrary properties like roleTitle
        const records = await Account.find(find).select("-password -token").lean({ virtuals: true });

        // Fetch all roles once to avoid N+1 queries
        const allRoles = await Role.find({ deleted: false }).lean({ virtuals: true });

        // for (const record of records){
        //     const role = await Role.findOne({_id: record.role_id, deleted: false})
        //     record.role = role; // file pug them item.role.title
        // }

        records.forEach((record) => {
            if (!record.role_id) {
                record.roleTitle = "Chưa phân quyền";
                return;
            }

            const roleIdStr = record.role_id.toString().trim();

            // Try matching by ObjectId (24-char hex) first
            let matched = allRoles.find(
                (r) => r._id.toString() === roleIdStr
            );

            // Fallback: match by title (for legacy data stored as Vietnamese text)
            if (!matched) {
                matched = allRoles.find(
                    (r) => r.title.toLowerCase() === roleIdStr.toLowerCase()
                );
            }

            record.roleTitle = matched ? matched.title : "Chưa phân quyền";
        });

        res.render("admin/pages/account/index", {
            pageTitle: "Danh sách tài khoản",
            records: records,
            keyword: objectSearch.keyword
        });
    } catch (error) {
        req.flash("error", "Hệ thống gặp lỗi khi tải danh sách.");
        res.redirect(`${prefixAdmin}/dashboard`);
    }
};


module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/account/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles
    });
};

module.exports.createPost = async (req, res) => {
    try {
        const emailExist = await Account.findOne({ email: req.body.email, deleted: false });
        if (emailExist) {
            req.flash("error", "Email đã tồn tại!");
            res.redirect("back");
            return;
        } else {
            req.body.password = md5(req.body.password);

            const record = new Account(req.body);
            await record.save();

            req.flash("success", "Tạo tài khoản mới thành công!");
            res.redirect(`${prefixAdmin}/accounts`);
        }


    } catch (error) {
        req.flash("error", "Tạo tài khoản thất bại.");
        res.redirect("back");
    }
};

module.exports.edit = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, deleted: false });
        const roles = await Role.find({ deleted: false });

        if (!account) {
            throw new Error("Account not found");
        }

        res.render("admin/pages/account/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy thông tin tài khoản");
        res.redirect(`${prefixAdmin}/accounts`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const emailExist = await Account.findOne({ 
            _id: { $ne: req.params.id },//tim ban ghi khong bao gom id nay (ne: not equal)
            email: req.body.email,
            deleted: false
        });
        if (emailExist) {
            req.flash("error", "Email đã tồn tại!");


        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }

            await Account.updateOne({ _id: req.params.id, deleted: false }, req.body);
            req.flash("success", "Cập nhật tài khoản thành công!");
        }


    } catch (error) {
        req.flash("error", "Cập nhật dữ liệu thất bại.");
    }
    res.redirect("back");
};

module.exports.detail = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, deleted: false });
        if (!account) {
            throw new Error("Account not found");
        }

        if (account.role_id && account.role_id.length === 24) {
            const role = await Role.findOne({ _id: account.role_id, deleted: false });
            if (role) {
                account.roleTitle = role.title;
            }
        } else {
            account.roleTitle = "Chưa phân quyền";
        }

        res.render("admin/pages/account/detail", {
            pageTitle: `Chi tiết: ${account.fullName}`,
            account: account
        });
    } catch (error) {
        req.flash("error", "Không tìm thấy thông tin tài khoản");
        res.redirect(`${prefixAdmin}/accounts`);
    }
};

module.exports.deleteItem = async (req, res) => {
    try {
        await Account.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });
        req.flash("success", "Xóa tài khoản thành công!");
    } catch (error) {
        req.flash("error", "Xóa tài khoản thất bại.");
    }
    res.redirect("back");
};
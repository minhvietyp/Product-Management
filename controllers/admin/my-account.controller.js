const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// GET /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Tài khoản của tôi",
    });
}


// GET /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
    });
}

// PATCH /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    try {
            const emailExist = await Account.findOne({ 
                _id: { $ne: req.locals.user.id },//tim ban ghi khong bao gom id nay (ne: not equal)
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
    
                await Account.updateOne({ _id: req.locals.user.id, deleted: false }, req.body);
                req.flash("success", "Cập nhật tài khoản thành công!");
            }
    
    
        } catch (error) { 
            req.flash("error", "Cập nhật dữ liệu thất bại.");
        }
        res.redirect(req.get("Referrer") || "/");
}

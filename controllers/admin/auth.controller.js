const Account = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');
const generateHelper = require('../../helpers/generate');
const Role = require('../../models/role.model');


// GET /admin/auth/login

module.exports.login = (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    } else {
        res.render('admin/pages/auth/login', {
            pageTitle: 'Đăng nhập',
        });
    }


    
}


// POST /admin/auth/login

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({email: email, deleted: false});
    if(!user){
        req.flash('error', 'Tài khoản không tồn tại!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(md5(password) !== user.password){
        req.flash('error', 'Sai mật khẩu!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    if(user.status !== 'active'){ // neu co nhieu trang thai thi so sanh == inactive
        req.flash('error', 'Tài khoản đã bị khóa!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }

    
    // Generate a fresh token on every login so each session is unique
    const newToken = generateHelper.generateRandomString(32);
    await Account.updateOne({ _id: user._id }, { token: newToken });

    // Tự động nạp full quyền cho Quản trị viên nếu mảng quyền đang trống
    if (user.role_id && user.role_id.toString().trim().length === 24) {
        const role = await Role.findOne({ _id: user.role_id.toString().trim() });
        if (role && role.title === "Quản trị viên" && role.permissions.length === 0) {
            await Role.updateOne(
                { _id: role._id },
                {
                    permissions: [
                        "products-category_view", "products-category_create", "products-category_edit", "products-category_delete",
                        "products_view", "products_create", "products_edit", "products_delete",
                        "roles_view", "roles_create", "roles_edit", "roles_delete", "roles_permissions",
                        "accounts_view", "accounts_create", "accounts_edit", "accounts_delete"
                    ]
                }
            );
        }
    }

    res.cookie("token", newToken);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}



// GET /admin/auth/logout

module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}

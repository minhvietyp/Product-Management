const User = require('../../models/user.model');

const md5 = require('md5');

// GET /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    })
}



// POST /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({ email: req.body.email });

    if (existEmail) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    });

    res.redirect("/");
}


// GET /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    })
}


// POST /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
        // status: "active"
    });

    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    if (md5(req.body.password) !== user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if(user.status === "inactive"){
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    });

    res.redirect("/");
}

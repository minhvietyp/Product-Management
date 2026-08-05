const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');

const generateHelper = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendMail');
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


// GET /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

// GET /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    })
}

// POST /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
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

    const otp = generateHelper.generateRandomNumber(6);

    // luu thong tin vao DB
    const objectForgotPassword = new ForgotPassword({
        email: req.body.email,
        otp: otp,
        expiresAt: Date.now(),
    });
    await objectForgotPassword.save();

    // neu ton tai email thi gui ma OTP ve email
    const subject = "Ma OPT de lay lai mat khau";
    const html = `
        <p>Mã OTP của bạn là: <b>${otp}</b></p>
        <p>Mã OTP sẽ hết hạn sau 10 phút</p>
    `;
    sendMailHelper.sendMail(req.body.email, subject, html);

    res.redirect(`/user/password/otp?email=${req.body.email}`);
}





// GET /user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email;
    
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email,
    })
}

// POST /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });
    
    if (!result) {
        req.flash("error", "Mã OTP không chính xác!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email,
        deleted: false,
        // status: "active"
    });

    // if (!user) {
    //     req.flash("error", "Email không tồn tại!");
    //     res.redirect("back");
    //     return;
    // }

    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    });
    
    res.redirect(`/user/password/reset?email=${email}`);
}

// GET /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu",
    })
}

// POST /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;
    
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });
    
    res.redirect("/");
    
}

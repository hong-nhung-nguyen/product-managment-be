const md5 = require("md5");

const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if(req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login.pug", {
        pageTitle: "Trang đăng nhập",
    })
    }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await Account.findOne({
            email: email,
            deleted: false
        });

        if(!user) {
            req.flash("error", "Tài khoản không tồn tại");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        if(user.password !== md5(password)){
            req.flash("error", "Mật khẩu không chính xác");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        
        if(user.status === "inactive") {
            req.flash("error", "Tài khoản đã bị khóa");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        res.cookie("token", user.token);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);

    }
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    // xóa token trong cookie
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}

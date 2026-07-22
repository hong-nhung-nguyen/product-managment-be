const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");

// [GET] /user/register 
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

// [POST] /user/register 
module.exports.registerPost = async (req, res) => {
    const email = req.body.email;

    const emailExist = await User.findOne({ email: email });

    if(emailExist) {
        req.flash("error", "Email already exists");
        res.redirect("/user/register");
        return;
    } 

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();
    
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Login"
    })
}

// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
    });

    if(!user) {
        req.flash("error", "Email does not exist");
        res.redirect("/user/login");
        return;
    }

    if(user.password !== md5(password)) {
        req.flash("error", "Password is incorrect");
        res.redirect("/user/login");
        return;
    }

    const cartExist = await Cart.findOne({
        user_id: user.id
    });

    if(!cartExist) {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        });
    } else {
        res.cookie("cartId", cartExist.id);
    }

    res.cookie("tokenUser", user.tokenUser); 
    res.redirect("/");
}

// [GET] /user/logout 
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
}

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Forgot Password"
    })
}

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email
    });

    if(!user) {
        req.flash("error", "Email does not exist!");
        res.redirect("/user/password/forgot");
        return
    }

    // Lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // If email exists then send OTP via email
    const subject = "Forgot Password OTP";
    const html = `Forgot Password OTP: <b>${otp}</b>. Thời hạn sử dụng là 3 phút`;
    sendMailHelper.sendMail(email, subject, html);

    // if user then send OTP via email

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email; 

    res.render("client/pages/user/otp-password", {
        pageTitle: "Enter OTP",
        email: email
    })
}

// [POST] user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const otpValid = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });
 
    if(!otpValid) {
        req.flash("error", "OTP is incorrect!");
        res.redirect(`/user/password/otp?email=${email}`);
        return;
    }

    const user = await User.findOne({
        email: email,
    });

    // tokenUser to make sure later the person who resets password
    // is the actual account holder
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET] user/password/reset
module.exports.reset = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Reset Password"
    })
}

// [POST] user/password/reset
module.exports.resetPost = async (req, res) => {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;

    if(tokenUser) {
        if (newPassword !== confirmPassword) {
                req.flash("error", "Mật khẩu không trùng nhau");
                res.redirect("/user/password/reset");
                return;
            }

        await User.updateOne({
            tokenUser: tokenUser
        }, {
            password: md5(newPassword)
        });

        req.flash("success", "Password reset successfully");
        res.redirect("/user/login");

    }
    else {
        res.redirect("/user/password/forgot");
    }
}

// [GET] user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "User Info",
    })
}










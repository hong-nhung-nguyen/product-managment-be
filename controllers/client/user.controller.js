const User = require("../../models/user.model");

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
        req.flash("error", "Email đã tồn tại");
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
        pageTitle: "Đăng nhập"
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
        req.flash("error", "Email không tồn tại");
        res.redirect("/user/login");
        return;
    }

    if(user.password !== md5(password)) {
        req.flash("error", "Mật khẩu không chính xác");
        res.redirect("/user/login");
        return;
    }

    res.cookie("tokenUser", user.tokenUser); 
    res.redirect("/");

    
    
}


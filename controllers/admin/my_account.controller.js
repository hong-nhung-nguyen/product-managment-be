const md5 = require("md5");

const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "My Account",
    })
}

// [GET] admin/my-account/edit
module.exports.edit = async (req, res) => {
    const record = await Account.findOne({ _id: res.locals.user.id });

    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit Profile",
        record: record
    })
}

// [PATCH] admin/my-account/edit
module.exports.editAccount = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            _id: { $ne: res.locals.user.id },
            email: req.body.email,
            deleted: false,
        });

        const phoneExist = await Account.findOne({
            _id: { $ne: res.locals.user.id },
            phone: req.body.phone,
            deleted: false
        });

        if(emailExist) {
            req.flash("error", "Email already exists");
        } else if(phoneExist) {
            req.flash("error", "Phone number already exists");
        } else {
            req.body.password = md5(req.body.password);

            await Account.updateOne({ _id: res.locals.user.id }, req.body);
            req.flash("success", "Profile updated successfully");
        }

    } catch(error) {
        console.log(error)
    }
    res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);


}


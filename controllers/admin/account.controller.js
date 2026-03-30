const md5 = require("md5");

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    // fetch everything except password and token
    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false, 
            _id: record.role_id
        });

        record.role = role;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create 
module.exports.create = async (req, res) => {
    let findRoles = {
        deleted: false
    }

    const roles = await Role.find(findRoles);

    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm tài khoản mới",
        roles: roles
    })
}

// [POST] /admin/accounts/create 
module.exports.createAccount = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            deleted: false,
            email: req.body.email
        })

        if(emailExist) {
            req.flash("error", "Email đã tồn tại");
            res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
        }

        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();
    } catch(error) {
        console.log(error);
    }

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

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
        pageTitle: "Account List",
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
        pageTitle: "Create Account",
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

// [GET] /admin/accounts/edit/:id 
module.exports.edit = async (req, res) => {
    let find = {
        deleted: false,
        _id: req.params.id
    };

    const record = await Account.findOne(find);

    const roles = await Role.find({
        deleted: false
    })

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Edit Account",
        record: record,
        roles: roles
    })
}

// [PATCH] /admin/accounts/edit/:id 
module.exports.editAccount = async (req, res) => {
    const id = req.params.id;

    try {
        console.log(id);

        // kiểm tra email đã tồn tại hay chưa, nếu tồn tại thì không update
        // $ne: not equal, tìm kiếm tất cả bản ghi có email trùng với email nhập vào nhưng id khác với id đang edit
        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        })

        if(emailExist) {
            req.flash("error", "Email đã tồn tại");

        } else {
            if(req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                // không nhập password mới thì giữ nguyên password cũ, 
                // không update password thành rỗng
                delete req.body.password;
            }

        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Account updated successfully");
        }
        
    } catch(error) {
        console.log(error);
        req.flash("error", "Failed to update account");
    }

    res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
}


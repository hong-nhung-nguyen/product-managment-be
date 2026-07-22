const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Role.find(find);
    
    res.render("admin/pages/roles/index", {
        pageTitle: "Role List",
        records: records,
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Create Role",
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {
    let find = {
        deleted: false,
        _id: req.params.id
    };

    const record = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
        pageTitle: "Edit Role",
        record: record
    })
}

// [PATCH] /admin/roles/edit
module.exports.editPost = async (req, res) => {
    const id = req.params.id;

    try {
        await Role.updateOne({ _id: id}, req.body);
        req.flash("success", "Update successful");
    } catch (error) {
        req.flash("error", "Update failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Permissions",
        records: records
    });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        
        for (const item of permissions) {
            const id = item.id;
            const permissions = item.permissions;
            await Role.updateOne({ _id: id }, { permissions: permissions });
        }

        req.flash("success", "Update permissions successful!");
    } catch(error) {
        req.flash("error", "Update permissions failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
}

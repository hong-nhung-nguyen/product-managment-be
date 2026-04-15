const SettingGeneral = require("../../models/setting-general.model");

const systemConfig = require("../../config/system");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
    // always return the first record
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/setting/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if(settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }

    req.flash("success", "Cập nhật thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/setting/general`);
}
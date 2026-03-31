const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    if (req.cookies.token) {
        const token = req.cookies.token;
        const user = await Account.findOne({ token: token }).select("-password");
        if(!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({
                deleted: false,
                _id: user.role_id,
            }).select("title permissions");

            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    } else {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
}
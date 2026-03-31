const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    if (req.cookies.token) {
        const token = req.cookies.token;
        const user = await Account.findOne({ token: token });
        if(!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            next();
        }
    } else {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
}
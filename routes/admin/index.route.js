const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./productsCategory.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my_account.route");
const settingRoutes = require("./setting.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
    // always have the "/admin" to differentiate with client side

    // use "use" cause the specific route dashboard already uses the "get" method inside
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes);

    app.use(
        PATH_ADMIN + "/products", 
        authMiddleware.requireAuth,
        productRoutes);

    app.use(
        PATH_ADMIN + "/products-category", 
        authMiddleware.requireAuth,
        productsCategoryRoutes);

    app.use(
        PATH_ADMIN + "/roles", 
        authMiddleware.requireAuth,
        roleRoutes);

    app.use(PATH_ADMIN + "/accounts", 
        authMiddleware.requireAuth,
        accountRoutes);

    app.use(PATH_ADMIN + "/auth", authRoutes);

    app.use(PATH_ADMIN + "/my-account",
        authMiddleware.requireAuth,
        myAccountRoutes
    )

    app.use(PATH_ADMIN + "/setting",
        authMiddleware.requireAuth,
        settingRoutes
    )
    
    // or
    // app.use("/admin/dashboard", dashboardRoutes);
}
const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./productsCategory.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");

module.exports = (app) => {
    // always have the "/admin" to differentiate with client side

    // use "use" cause the specific route dashboard already uses the "get" method inside
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productRoutes);

    app.use(PATH_ADMIN + "/products-category", productsCategoryRoutes);

    app.use(PATH_ADMIN + "/roles", roleRoutes);

    app.use(PATH_ADMIN + "/accounts", accountRoutes);
    
    // or
    // app.use("/admin/dashboard", dashboardRoutes);
}
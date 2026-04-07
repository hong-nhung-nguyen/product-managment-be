const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    // this middleware can be used for every routes
    app.use(categoryMiddleware.category);

    app.use("/", homeRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/products", productRoutes);
}
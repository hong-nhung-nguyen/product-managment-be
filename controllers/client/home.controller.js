const Product = require("../../models/product.model");
const ProductCategory = require("../../models/productCategory.module");

const createTreeHelper = require("../../helpers/createTree");
const productHelper = require("../../helpers/product");


// [GET] /
module.exports.index = async (req, res) => {
    // Fetch Featured Products 
    const featuredRecords = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(3);

    const newProducts = productHelper.priceNewProducts(featuredRecords);
    // End Fetch Featured Products

    // Fetch the Latest Products
    const latestProducts = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" }).limit(6);
    // End Fetch the Latest Products

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        featuredRecords: newProducts,
        latestProducts: latestProducts
    });
}
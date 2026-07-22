const ProductCategory = require("../../models/productCategory.module");

const productHelper = require("../../helpers/product");
const createTreeHelper = require("../../helpers/createTree");
const productCategoryHelper = require("../../helpers/product-category");

// [GET] /products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
        .sort({ position: "desc" });

    const newProducts = productHelper.priceNewProducts(products);

    // console.log(products);

    res.render("client/pages/products/index", {
        pageTitle: "Products",
        products: newProducts
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            status: "active",
            deleted: false,
            slug: req.params.slugProduct
        };

        const product = await Product.findOne(find);
        if (!product) {
            throw new Error("Product not found");
        }

        const newProduct = productHelper.priceNewProducts([product])[0];

        if (newProduct.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: newProduct.product_category_id,
                deleted: false,
                status: "active"
            });

            newProduct.category = category;
        }

        res.render("client/pages/products/detail", {
            pageTitle: newProduct.title,
            product: newProduct
        });
    } catch(error) {
        res.redirect("/products");
    }
}

// [GET] /products/:slugCategory 
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false,
        status: "active"
    });


    const listSubCategory = await productCategoryHelper.getSubCategory(category.id); 

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        deleted: false,
        status: "active",
        product_category_id: { $in: [category.id, ...listSubCategoryId]}
    });


    res.render("client/pages/productCategory/index", {
        pageTitle: category.title,
        category: category,
        records: products
    })
}


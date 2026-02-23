const mongoose = require("mongoose");

// this is how a product should look like 
const productSchema = new mongoose.Schema({
    title: String,
    description: String, 
    price: Number,
    discountPercentage: Number,
    stock: Number, 
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deletedAt: Date
});

//            model name (used in code) - rules to follow - mongoDB collection name
const Product = mongoose.model("Product", productSchema, "products");
// Product is the tool to talk to the "products" collection 
// now they can:
//     + add product
//     + get product 
//     + update product 
//     + delete product 

module.exports = Product;
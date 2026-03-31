const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// this is how a product should look like 
const productSchema = new mongoose.Schema({
    // have to match with "name"
    title: String, // Sản phẩm 1
    product_category_id: {
        type: String,
        default: ""
    },
    description: String, 
    price: Number,
    discountPercentage: Number,
    stock: Number, 
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title", // san-pham-1
        unique: true // to get unique id for same product titles
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    }
}, {
    timestamps: true  
});

// timestamps = true
// => automatically has createAt & updateAt

//            model name (used in code) - rules to follow - mongoDB collection name
const Product = mongoose.model("Product", productSchema, "products");
// Product is the tool to talk to the "products" collection 
// now they can:
//     + add product
//     + get product 
//     + update product 
//     + delete product 

module.exports = Product;
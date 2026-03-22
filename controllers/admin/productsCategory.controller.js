const ProductCategory = require("../../models/productCategory.module");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find)
        .sort({
            position: "desc",
        })
    
    const newRecords = createTreeHelper(records);

    res.render("admin/pages/productsCategory/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
    })
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    
    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    // console.log(newRecords);


    res.render("admin/pages/productsCategory/create", {
        pageTitle: "Tạo mới danh mục sản phẩm",
        records: newRecords,
    })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}
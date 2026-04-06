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
    const permissions = res.locals.role.permissions;

    // if somebody knows the route, they still can use postman to send
    // data so except blocking them from viewing the features
    // so have to block the controller as well
    if(permissions.includes("products-category_create")){
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
    
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({ 
            _id: id,
            deleted: false
        });

        // only automatically throw error is id is invalid (not in mongodb id format)

        if(data === null) {
            throw new Error("Record not found")
        }

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelper(records);

        // console.log(newRecords);

        const record = await ProductCategory.findOne({ _id: req.params.id });

        res.render("admin/pages/productsCategory/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords,
        })
    } catch (error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPost = async (req, res) => {
    try {
        const id = req.params.id;
        await ProductCategory.updateOne({ _id: id}, req.body);
        req.flash("success", "Cập nhật thành công");
    } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    }   
    res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
}


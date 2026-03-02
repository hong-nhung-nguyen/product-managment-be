const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const redirectHelper = require("../../helpers/redirect");
const redirect = require("../../helpers/redirect");


// [GET] /admin/products

module.exports.index = async (req, res) => {

    // Filter status
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status
    }
    // End filter status



    // Search by keyword
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End search by keyword



    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    )
    // End Pagination

    const products = await Product.find(find)
    // asc = tăng
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    let page;
    if (req.query.page) {
        page = req.query.page;
    } else {
        page = 1;
    }



    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        page: parseInt(req.query.page)
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res, next) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");

    redirectHelper(req, res);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // when we pass the data into the form this console log line
    // should print out the request body but at the moment it returns
    // undefined => we have to install a SEPARATE LIBIRARY (body parser) to get req.body property
    const type = req.body.type;

    // convert lại thành 1 mảng
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids }}, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        // Delete-multi
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids }}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        // Change-position
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position })
            }
            req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
            break
        default:
            break;
    }

    // req.query = GET
    // req.body = POST - PATCH - PUT

    redirectHelper(req, res);
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // delete permanently
    // await Product.deleteOne( { _id: id });

    // delete temporarily (update "deleted")
    await Product.updateOne( { _id: id }, { 
        deleted: true,
        deletedAt: new Date()
     });
    // patch is also accepted, but we want to follow the correct logic
    // when users actually use the app (delete an item)

    req.flash("success", `Đã xóa thành công sản phẩm!`);

    redirectHelper(req, res);
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    // console.log(req.file);


    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);


    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // req.file có 1 biến nữa (path) gần giống với "filename"
    // nhưng mà có "public" đứng trước
    // không chọn "path" vì khi search sẽ không có "public"

    // if user tampers with public js by deleting "required" for the title input
    // we cant set the name for the image => server dies
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // create a new product

    // create in module - not save
    const newProduct = new Product(req.body);

    // save into database
    await newProduct.save();
    
    // local variables (declare in index.js) can only be used in pug file
    // for js files like this have to be imported
    res.redirect(`${systemConfig.prefixAdmin}/products`);   
};


 



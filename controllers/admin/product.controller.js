const Product = require("../../models/product.model");

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

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

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
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

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
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids }}, { status: "inactive" });
            break;
        default:
            break;
    }

    // req.query = GET
    // req.body = POST - PATCH - PUT

    redirectHelper(req, res);
}

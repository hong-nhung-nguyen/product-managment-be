const express = require("express");
const router = express.Router();

const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });


const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index)

// Cannot GET /admin/products/change-status/inactive/123
// :name = assign dynamic data
router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single("thumbnail"),
    validate.createPost,
    controller.createPost
);
// middleware

// validate.createPost() will call the function immediately => nothing yet to know => crash
// validate.createPost just passing the function

module.exports = router;
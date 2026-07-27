const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const controller = require("../../controllers/admin/productsCategory.controller");
const validate = require("../../validates/admin/productsCategory.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const configSystem = require("../../config/system");


router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost(`${configSystem.prefixAdmin}/products-category/create`),
    controller.createPost
)

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost((req) => `${configSystem.prefixAdmin}/products-category/edit/${req.params.id}`),
    controller.editPost

)

module.exports = router;
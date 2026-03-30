const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const accountController = require("../../controllers/admin/account.controller");
const validate = require('../../validates/admin/account.validate');

router.get("/", accountController.index);

router.get("/create", accountController.create);

router.post(
    "/create",
    (req, res, next) => {
        req.uploadFolder = "account-avatars";
        next();
    },
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost("/admin/accounts/create"),
    accountController.createAccount
);

module.exports = router;
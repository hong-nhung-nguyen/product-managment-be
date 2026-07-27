const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

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

router.get("/edit/:id", accountController.edit);

router.patch(
    "/edit/:id",
    (req, res, next) => {
        req.uploadFolder = "account-avatars";
        next();
    },
    upload.single("avatar"),
    uploadCloud.upload,
    validate.editPost((req) => `/admin/accounts/edit/${req.params.id}`),
    accountController.editAccount
);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller")

router.get("/", controller.index)

// Cannot GET /admin/products/change-status/inactive/123
// :name = assign dynamic data
router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti);

module.exports = router;
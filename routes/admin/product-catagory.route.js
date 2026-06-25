const express = require('express');
const route = express.Router();
const multer = require('multer');

// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validate/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

route.get("/", controller.index);

route.patch("/change-status/:status/:id", controller.changeStatus);

route.patch("/change-multi", controller.changeMulti);

route.delete("/delete/:id", controller.deleteItem);

route.get("/create", controller.create);

route.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

route.get("/edit/:id", controller.edit);

route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

route.get("/detail/:id", controller.detail);








module.exports = route;

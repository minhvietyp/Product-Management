const express = require('express');
const route = express.Router();
const multer = require('multer');

const upload = multer();

const controller = require('../../controllers/admin/setting.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')


route.get('/general', controller.general);

route.patch(
    '/general',
    upload.single('logo'),
    uploadCloud.upload,
    controller.patchGeneral
);



module.exports = route;
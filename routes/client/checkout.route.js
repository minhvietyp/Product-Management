const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/checkout.controller');

route.get('/', controller.index);


module.exports = route;
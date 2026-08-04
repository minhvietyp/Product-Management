const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/user.controller');

const validateUser = require("../../validate/client/user.validate");

route.get('/register', controller.register);

route.post('/register',validateUser.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validateUser.loginPost, controller.loginPost);

module.exports = route;
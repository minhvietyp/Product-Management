const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/user.controller');

const validateUser = require("../../validate/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

route.get('/register', controller.register);

route.post('/register',validateUser.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validateUser.loginPost, controller.loginPost);

route.get("/logout", controller.logout);

route.get("/password/forgot", controller.forgotPassword);

route.post("/password/forgot", validateUser.forgotPasswordPost, controller.forgotPasswordPost);

route.get("/password/otp", controller.otp);

route.post("/password/otp", validateUser.otpPost, controller.otpPost);

route.get("/password/reset", controller.resetPassword);

route.post("/password/reset", validateUser.resetPasswordPost, controller.resetPasswordPost);

route.get("/info", authMiddleware.requireAuth, controller.info)



module.exports = route;

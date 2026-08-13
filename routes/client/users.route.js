const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/users.controller');

const authMiddleware = require("../../middlewares/client/auth.middleware");

route.get("/not-friend", authMiddleware.requireAuth, controller.notFriend)

route.get("/friends", authMiddleware.requireAuth, controller.friends)

route.get("/request", authMiddleware.requireAuth, controller.request)

route.get("/accept", authMiddleware.requireAuth, controller.accept)



module.exports = route;

const userRoute = require('express').Router();
const userController = require('../../controllers/user/user.controller');

userRoute.get('/', userController.getHomePage);

module.exports = userRoute;

const userRoute = require('express').Router();
const userController = require('../../controllers/user/user.controller');

userRoute.get('/', userController.getHomePage);
userRoute.get('/package/:packageId', userController.getPackageDetail);

module.exports = userRoute;

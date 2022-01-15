const userRoute = require('express').Router();
const userController = require('../../controllers/user/index.controller');

userRoute.get('/', userController.getHomePage);
userRoute.get('/package/:packageId', userController.getPackageDetail);
userRoute.get('/cart', userController.getCart);

module.exports = userRoute;

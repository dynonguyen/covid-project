const userRoute = require('express').Router();
const userController = require('../../controllers/user/index.controller');
const userInfoRoute = require('./info.route');

userRoute.get('/', userController.getHomePage);
userRoute.get('/package/:packageId', userController.getPackageDetail);
userRoute.get('/cart', userController.getCart);
userRoute.use('/info', userInfoRoute);

module.exports = userRoute;

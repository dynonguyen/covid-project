const userRoute = require('express').Router();
const userController = require('../../controllers/user/index.controller');
const userInfoRoute = require('./info.route');
const paymentRoute = require('./payment.route');

userRoute.get('/', userController.getHomePage);
userRoute.get('/package/:packageId', userController.getPackageDetail);
userRoute.get('/cart', userController.getCart);
userRoute.use('/info', userInfoRoute);
userRoute.use('/payment', paymentRoute);

module.exports = userRoute;

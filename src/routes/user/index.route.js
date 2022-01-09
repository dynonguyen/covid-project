
const productRoute = require('./product.route');
const userRoute = require('express').Router();
const userController = require('./../../controllers/user/users.controller')

userRoute.use('/products', productRoute);
userRoute.get('/:username', userController.getUserList)
userRoute.get('/', userController.getUser)
module.exports = userRoute;

const productPackageMgmtRoute = require('./product-packages.route');
const productMgmtRoute = require('./products.route');
const userMgmtRoute = require('./users.route');
const managementRoute = require('express').Router();

managementRoute.get('/', (req, res) => res.redirect('/management/users/list'));
managementRoute.use('/users', userMgmtRoute);
managementRoute.use('/products', productMgmtRoute);
managementRoute.use('/product-packages', productPackageMgmtRoute);

module.exports = managementRoute;

const productMgmtRoute = require('express').Router();
const productMgmtController = require('../../controllers/management/products.controller');

productMgmtRoute.get('/', (req, res) =>
	res.redirect('/management/products/list')
);

productMgmtRoute.get('/list', productMgmtController.getProductList);

module.exports = productMgmtRoute;

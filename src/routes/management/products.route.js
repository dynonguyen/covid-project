const productMgmtRoute = require('express').Router();
const productMgmtController = require('../../controllers/management/products.controller');

productMgmtRoute.get('/', (req, res) =>
	res.redirect('/management/products/list')
);

productMgmtRoute.get('/list', productMgmtController.getProductList);

productMgmtRoute.delete('/:productId', productMgmtController.deleteProduct);

productMgmtRoute.put('/:productId', productMgmtController.putUpdateProductInfo);

module.exports = productMgmtRoute;

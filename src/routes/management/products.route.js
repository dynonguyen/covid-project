const productMgmtRoute = require('express').Router();
const productMgmtController = require('../../controllers/management/products.controller');

productMgmtRoute.get('/', (req, res) =>
	res.redirect('/management/products/list')
);
productMgmtRoute.get('/list', productMgmtController.getProductList);
productMgmtRoute.get('/new', productMgmtController.getNewProduct);

productMgmtRoute.delete('/:productId', productMgmtController.deleteProduct);

productMgmtRoute.post('/new', productMgmtController.postNewProduct);

productMgmtRoute.put('/:productId', productMgmtController.putUpdateProductInfo);

module.exports = productMgmtRoute;

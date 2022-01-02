const productMgmtRoute = require('express').Router();
const productMgmtController = require('../../controllers/management/products.controller');
const multer = require('multer');
const upload = multer();
const customUpload = upload.fields([
	{
		name: 'thumbnail',
		maxCount: 1,
	},
	{
		name: 'photos',
		maxCount: 5,
	},
]);

productMgmtRoute.get('/', (req, res) =>
	res.redirect('/management/products/list')
);
productMgmtRoute.get('/list', productMgmtController.getProductList);
productMgmtRoute.get('/new', productMgmtController.getNewProduct);

productMgmtRoute.delete('/:productId', productMgmtController.deleteProduct);

productMgmtRoute.post(
	'/new',
	customUpload,
	productMgmtController.postNewProduct
);
productMgmtRoute.post(
	'/change-avt/:productId',
	upload.single('photo'),
	productMgmtController.postChangeProductAvt
);
productMgmtRoute.post(
	'/photo/:productId',
	upload.single('photo'),
	productMgmtController.postAddProductPhoto
);

// PUT method because send "url" from body
productMgmtRoute.put('/del-photo', productMgmtController.deleteProductPhoto);
productMgmtRoute.put('/:productId', productMgmtController.putUpdateProductInfo);

module.exports = productMgmtRoute;

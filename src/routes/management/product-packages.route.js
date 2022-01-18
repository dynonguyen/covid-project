const productPackageMgmtRoute = require('express').Router();
const productPackageMgmtController = require('../../controllers/management/product-packages.controller');

productPackageMgmtRoute.get(
	'/list',
	productPackageMgmtController.getProductPackage
);
productPackageMgmtRoute.get(
	'/list/:packageId',
	productPackageMgmtController.getPackageDetail
);
productPackageMgmtRoute.get('/new', productPackageMgmtController.getNewPackage);

productPackageMgmtRoute.put(
	'/update',
	productPackageMgmtController.putUpdatePackage
);

productPackageMgmtRoute.delete(
	'/:packageId',
	productPackageMgmtController.deletePackage
);

module.exports = productPackageMgmtRoute;

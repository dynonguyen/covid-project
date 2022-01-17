const productPackageMgmtRoute = require('express').Router();
const productPackageMgmtController = require('../../controllers/management/product-packages.controller');

productPackageMgmtRoute.get(
	'/list',
	productPackageMgmtController.getProductPackage
);
productPackageMgmtRoute.get(
	'/:packageId',
	productPackageMgmtController.getPackageDetail
);

productPackageMgmtRoute.put(
	'/update',
	productPackageMgmtController.putUpdatePackage
);

module.exports = productPackageMgmtRoute;

const productPackageMgmtRoute = require('express').Router();
const productPackageMgmtController = require('../../controllers/management/product-packages.controller');

productPackageMgmtRoute.get(
	'/list',
	productPackageMgmtController.getProductPackage
);
productPackageMgmtRoute.get(
	'/:productPackageId',
	productPackageMgmtController.getPackageDetail
);

module.exports = productPackageMgmtRoute;

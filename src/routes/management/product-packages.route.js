const productPackageMgmtRoute = require('express').Router();
const productPackageMgmtController = require('../../controllers/management/product-packages.controller');

productPackageMgmtRoute.get(
	'/',
	productPackageMgmtController.getProductPackage
);

module.exports = productPackageMgmtRoute;

const apiRoute = require('express').Router();
const apiController = require('../controllers/api.controller');

apiRoute.get('/provinces', apiController.getAllProvince);
apiRoute.get('/district/:provinceId', apiController.getDistrictOfProvince);
apiRoute.get('/ward/:districtId', apiController.getWardOfDistrict);
apiRoute.get('/users/statusF/:statusF', apiController.getUserWithStatus);
apiRoute.get('/iso-facilities', apiController.getAllIsolationFacilities);
apiRoute.get('/packages', apiController.getProductPackages);
apiRoute.get('/check-limit-package', apiController.getCheckUserLimitPackage);
apiRoute.get('/products', apiController.getProducts);

apiRoute.post('/new-payment-history', apiController.postNewPaymentHistory);

module.exports = apiRoute;

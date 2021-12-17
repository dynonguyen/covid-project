const apiRoute = require('express').Router();
const apiController = require('../controllers/api.controller');

apiRoute.get('/provinces', apiController.getAllProvince);
apiRoute.get('/district/:provinceId', apiController.getDistrictOfProvince);
apiRoute.get('/ward/:districtId', apiController.getWardOfDistrict);
apiRoute.get('/users/statusF/:statusF', apiController.getUserWithStatus);
apiRoute.get('/iso-facilities', apiController.getAllIsolationFacilities);

module.exports = apiRoute;

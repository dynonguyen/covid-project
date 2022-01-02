const iltFactAdminRoute = require('express').Router();
const iltFactAdminController = require('../../controllers/admin/isolation-facilities.controller');
iltFactAdminRoute.get('/list', iltFactAdminController.getILFList);

module.exports = iltFactAdminRoute;

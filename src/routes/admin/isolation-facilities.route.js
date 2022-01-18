const iltFactAdminRoute = require('express').Router();
const iltFactAdminController = require('../../controllers/admin/isolation-facilities.controller');

iltFactAdminRoute.get('/list', iltFactAdminController.getILFList);
iltFactAdminRoute.put('/update', iltFactAdminController.putUpdateIF);

module.exports = iltFactAdminRoute;

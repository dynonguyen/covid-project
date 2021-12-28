const managerAdminRoute = require('express').Router();
const managerAdminController = require('../../controllers/admin/managers.controller');

managerAdminRoute.get('/list', managerAdminController.getManagerList);
// managersAdminRoute.get('/new', managersAdminController.getNewManagerForm);

// managersAdminRoute.post('/new', managersAdminController.postNewManager);

module.exports = managerAdminRoute;

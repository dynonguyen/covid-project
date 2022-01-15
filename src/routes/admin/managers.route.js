const managerAdminRoute = require('express').Router();
const managerAdminController = require('../../controllers/admin/managers.controller');

managerAdminRoute.get('/list', managerAdminController.getManagerList);
managerAdminRoute.get('/:accountId', managerAdminController.getManager);
managerAdminRoute.put('/update', managerAdminController.putUpdateIsLocked);

// managersAdminRoute.get('/new', managersAdminController.getNewManagerForm);

// managersAdminRoute.post('/new', managersAdminController.postNewManager);

module.exports = managerAdminRoute;

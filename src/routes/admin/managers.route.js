const managerAdminRoute = require('express').Router();
const managerAdminController = require('../../controllers/admin/managers.controller');

managerAdminRoute.get('/list', managerAdminController.getManagerList);
managerAdminRoute.get('/new', managerAdminController.getNewManagerForm);
managerAdminRoute.post('/new', managerAdminController.postNewManager);
managerAdminRoute.get('/:accountId', managerAdminController.getManager);
managerAdminRoute.put('/update', managerAdminController.putUpdateIsLocked);

module.exports = managerAdminRoute;

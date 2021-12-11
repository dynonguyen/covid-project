const userMgmtRoute = require('express').Router();
const userMgmtController = require('../../controllers/management/users.controller');

userMgmtRoute.get('/list', userMgmtController.getUserList);
userMgmtRoute.get('/:uuid', userMgmtController.getUser);

module.exports = userMgmtRoute;

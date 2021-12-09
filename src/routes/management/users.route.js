const userMgmtRoute = require('express').Router();
const userMgmtController = require('../../controllers/management/users.controller');

userMgmtRoute.get('/list', userMgmtController.getUserList);

module.exports = userMgmtRoute;

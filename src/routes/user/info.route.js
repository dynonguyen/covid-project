const userInfoRoute = require('express').Router();
const userInfoController = require('../../controllers/user/info.controller');

userInfoRoute.get('/', userInfoController.getUserInfo);
userInfoRoute.get(
	'/management-history',
	userInfoController.getManagementHistory
);

module.exports = userInfoRoute;

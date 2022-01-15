const userInfoRoute = require('express').Router();
const userInfoController = require('../../controllers/user/info.controller');

userInfoRoute.get('/', userInfoController.getUserInfo);
userInfoRoute.get(
	'/management-history',
	userInfoController.getManagementHistory
);
userInfoRoute.get(
	'/consumption-history',
	userInfoController.getConsumptionHistory
);
userInfoRoute.get('/payment-history', userInfoController.getPaymentHistory);

module.exports = userInfoRoute;

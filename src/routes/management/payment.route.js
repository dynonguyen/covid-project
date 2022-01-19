const paymentRoute = require('express').Router();
const paymentController = require('../../controllers/management/payment.controller');

paymentRoute.get('/minium-limit', paymentController.getMinimumLimit);
paymentRoute.get('/debt-list', paymentController.getDebtList);
paymentRoute.put('/minium-limit', paymentController.putUpdateMinimumLimit);
paymentRoute.post(
	'/remind-pay-debt/:userId',
	paymentController.postRemindUserPayDebt
);

module.exports = paymentRoute;

const paymentRoute = require('express').Router();
const paymentController = require('../../controllers/user/payment.controller');

paymentRoute.get('/put-money', paymentController.getPutMoney);
paymentRoute.post('/', paymentController.postPayment);

module.exports = paymentRoute;

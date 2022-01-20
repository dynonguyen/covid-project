const statisticRoute = require('express').Router();
const statisticController = require('../../controllers/management/statistic.controller');

statisticRoute.get(
	'/statusf-time',
	statisticController.getStatusfTimeStatistic
);

statisticRoute.get('/consumption', statisticController.getConsumptionStatistic);
statisticRoute.get('/payment', statisticController.getPaymentStatistic);

module.exports = statisticRoute;

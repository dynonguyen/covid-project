const statisticRoute = require('express').Router();
const statisticController = require('../../controllers/management/statistic.controller');

statisticRoute.get(
	'/statusf-time',
	statisticController.getStatusfTimeStatistic
);

statisticRoute.get(
	'/packages-time',
	statisticController.getPackagesTimeStatistic
);

module.exports = statisticRoute;

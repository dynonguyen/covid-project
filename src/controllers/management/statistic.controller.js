const { Sequelize } = require('sequelize');
const TreatmentHistory = require('../../models/treatment-history.model');
const { Op } = require('../../configs/db.config');
const ConsumptionHistory = require('../../models/consumption-history.model');
const PaymentHistory = require('../../models/payment-history.model');

exports.getStatusfTimeStatistic = async (req, res) => {
	const { start, end } = req.query;
	const andOps = [];
	start &&
		andOps.push({
			startDate: {
				[Op.gte]: new Date(start),
			},
		});
	end &&
		andOps.push({
			startDate: {
				[Op.lte]: new Date(end),
			},
		});

	const where = {
		[Op.and]: andOps,
	};

	try {
		const statusCount = await TreatmentHistory.findAll({
			raw: true,
			attributes: [
				[Sequelize.fn('count', Sequelize.col('statusF')), 'count'],
				'statusF',
			],
			where,
			group: 'statusF',
		});

		const statusCountSort = statusCount
			.sort((a, b) => a.statusF - b.statusF)
			.map((i) => Number(i.count));

		return res.render('./management/statistic/statusf-time.pug', {
			chartData: statusCountSort,
			start,
			end,
		});
	} catch (error) {
		console.error('Function getStatusfTimeStatistic Error: ', error);
		return res.render('404');
	}
};

exports.getPackagesTimeStatistic = async (req, res) => {
	const { start, end } = req.query;
	const andOps = [];
	start &&
		andOps.push({
			startDate: {
				[Op.gte]: new Date(start),
			},
		});
	end &&
		andOps.push({
			startDate: {
				[Op.lte]: new Date(end),
			},
		});

	const where = {
		[Op.and]: andOps,
	};

	try {
		const consumptionStat = await ConsumptionHistory.findAll({
			raw: true,
			attributes: ['buyDate', 'productPackageId', 'totalPrice'],
			where,
			group: ['buyDate', 'productPackageId', 'totalPrice'],
		});

		let totalPriceArr = [];
		for (let i = 0; i < consumptionStat.length; ++i) {
			totalPriceArr.push(consumptionStat[i].totalPrice);
		}

		let productPackageIdArr = [];
		for (let i = 0; i < consumptionStat.length; ++i) {
			productPackageIdArr.push(consumptionStat[i].productPackageId);
		}

		return res.render('./management/statistic/packages-time.pug', {
			chartData: totalPriceArr,
			chartDataX: productPackageIdArr,
			end,
		});
	} catch (error) {
		console.error('Function getStatusfTimeStatistic Error: ', error);
		return res.render('404');
	}
};

exports.getPaymentTimeStatistic = async (req, res) => {
	const { start, end } = req.query;
	const andOps = [];
	start &&
		andOps.push({
			startDate: {
				[Op.gte]: new Date(start),
			},
		});
	end &&
		andOps.push({
			startDate: {
				[Op.lte]: new Date(end),
			},
		});

	const where = {
		[Op.and]: andOps,
	};

	try {
		const paymentStat = await PaymentHistory.findAll({
			raw: true,
			attributes: ['paymentHistoryId', 'userId', 'currentBalance'],
			where,
			group: ['paymentHistoryId', 'userId', 'currentBalance'],
		});

		const paymentStatSort = paymentStat
			.sort((a, b) => a.paymentHistoryId - b.paymentHistoryId)
			.map((i) => i);

		let userIdArr = [];
		for (let i = 0; i < paymentStatSort.length; ++i) {
			userIdArr.push(paymentStatSort[i].userId);
		}

		let currentBalanceArr = [];
		for (let i = 0; i < paymentStatSort.length; ++i) {
			currentBalanceArr.push(paymentStatSort[i].currentBalance);
		}

		return res.render('./management/statistic/payment-time.pug', {
			chartData: currentBalanceArr,
			chartDataX: userIdArr,
			end,
		});
	} catch (error) {
		console.error('Function getStatusfTimeStatistic Error: ', error);
		return res.render('404');
	}
};

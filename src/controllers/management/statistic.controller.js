const { Sequelize } = require('sequelize');
const TreatmentHistory = require('../../models/treatment-history.model');
const { Op } = require('../../configs/db.config');
const ConsumptionHistory = require('../../models/consumption-history.model');
const PaymentHistory = require('../../models/payment-history.model');
const { getUserDebtList } = require('../../payment-api');

async function statsRevenueByMonth(month = 1, year = new Date().getFullYear()) {
	const start = new Date(year, month - 1, 1);
	const end = new Date(year, month - 1, 30);

	try {
		const data = await ConsumptionHistory.findAndCountAll({
			raw: true,
			where: {
				buyDate: {
					[Op.and]: [{ [Op.gte]: start }, { [Op.lt]: end }],
				},
			},
			attributes: ['totalPrice'],
		});

		const revenue = data.rows.reduce((sum, item) => sum + item.totalPrice, 0);

		return { count: data.count, revenue };
	} catch (error) {
		console.log('FUNCTION getRevenueByMonth ERROR: ', error);
		return { count: 0, revenue: 0 };
	}
}

async function statsPaymentByMonth(month = 1, year = new Date().getFullYear()) {
	const start = new Date(year, month - 1, 1);
	const end = new Date(year, month - 1, 30);

	try {
		const sum = await PaymentHistory.sum('totalMoney', {
			where: {
				paymentDate: {
					[Op.and]: [{ [Op.gte]: start }, { [Op.lt]: end }],
				},
			},
		});

		return sum;
	} catch (error) {
		console.log('Function statsPaymentByMonth ERROR: ', error);
		return 0;
	}
}

function statsDebtByMonth(
	month = 1,
	year = new Date().getFullYear(),
	debtList = []
) {
	const start = new Date(year, month - 1, 1).getTime();
	const end = new Date(year, month - 1, 30).getTime();
	let sum = 0;

	debtList.forEach((item) => {
		const updatedTime = new Date(item.updatedTime).getTime();
		if (updatedTime >= start && updatedTime <= end) {
			sum += item.debt - item.returned;
		}
	});

	return sum;
}

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

exports.getConsumptionStatistic = async (req, res) => {
	const year = Number(req.query.year) || new Date().getFullYear();

	const revenues = new Array(12).fill(0),
		totalPackages = new Array(12).fill(0);
	try {
		const promises = [];
		for (let i = 1; i <= 12; ++i) {
			promises.push(
				statsRevenueByMonth(i, year).then((data) => {
					revenues[i - 1] = data.revenue;
					totalPackages[i - 1] = data.count;
				})
			);
		}
		await Promise.all(promises);

		return res.render('./management/statistic/consumption.pug', {
			revenues,
			totalPackages,
			year,
		});
	} catch (error) {
		console.error('Function getConsumptionStatistic Error: ', error);
		return res.render('./management/statistic/consumption.pug', {
			revenues: new Array(12).fill(0),
			totalPackages: new Array(12).fill(0),
			year,
		});
	}
};

exports.getPaymentStatistic = async (req, res) => {
	const year = Number(req.query.year) || new Date().getFullYear();
	const payments = new Array(12).fill(0),
		debts = new Array(12).fill(0);

	try {
		const promises = [];

		promises.push(
			getUserDebtList().then((debtList) => {
				for (let i = 1; i <= 12; ++i) {
					debts[i - 1] = statsDebtByMonth(i, year, debtList);
				}
			})
		);

		for (let i = 1; i <= 12; ++i) {
			promises.push(
				statsPaymentByMonth(i, year).then((sum) => {
					payments[i - 1] = sum;
				})
			);
		}
		await Promise.all(promises);

		return res.render('./management/statistic/payment.pug', {
			payments,
			debts,
			year,
		});
	} catch (error) {
		console.error('Function getPaymentStatistic Error: ', error);
		return res.render('./management/statistic/payment.pug', {
			payments,
			debts,
			year,
		});
	}
};

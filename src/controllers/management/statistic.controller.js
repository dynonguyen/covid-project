const { Sequelize } = require('sequelize');
const TreatmentHistory = require('../../models/treatment-history.model');
const { Op } = require('../../configs/db.config');

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

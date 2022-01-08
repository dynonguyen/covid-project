const { Sequelize } = require('sequelize');
const Province = require('../../models/province.model');
const TreatmentHistory = require('../../models/treatment-history.model');

exports.getStatusfTimeStatistic = async (req, res) => {
	try {
		const provinces = await Province.findAll({
			raw: true,
			attributes: { exclude: ['code'] },
		});

		const statusCount = await TreatmentHistory.findAll({
			raw: true,
			attributes: [
				[Sequelize.fn('count', Sequelize.col('statusF')), 'count'],
				'statusF',
			],
			group: 'statusF',
		});

		const statusCountSort = statusCount
			.sort((a, b) => a.statusF - b.statusF)
			.map((i) => Number(i.count));

		return res.render('./management/statistic/statusf-time.pug', {
			provinces,
			chartData: statusCountSort,
		});
	} catch (error) {
		console.error('Function getStatusfTimeStatistic Error: ', error);
		return res.render('404');
	}
};

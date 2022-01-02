const { ACCOUNT_TYPES } = require('../../constants/index.constant');
const { MAX } = require('../../constants/index.constant');
const Account = require('../../models/account.model');
const { Op } = require('../../configs/db.config');
const { Sequelize } = require('sequelize');
const { parseSortStr } = require('../../helpers/index.helpers');

exports.getManagerList = async (req, res) => {
	try {
		let { page = 1, sort = '', search = '' } = req.query;
		const sortList = parseSortStr(sort);
		const order = sortList.map((i) => i.split(' '));

		page = Number(page);
		if (isNaN(page) || page < 1) page = 1;

		const managers = await Account.findAndCountAll({
			raw: true,
			order,
			attributes: ['username', 'isLocked', 'failedLoginTime'],
			where: {
				[Op.and]: [
					{ accountType: ACCOUNT_TYPES.MANAGER },
					{
						username: Sequelize.where(
							Sequelize.fn('LOWER', Sequelize.col('username')),
							'LIKE',
							`%${search.toLowerCase()}%`
						),
					},
				],
			},
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});
		const managerList = managers.rows;

		return res.render('./admin/managers/view-list', {
			managerList,
			total: managers.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			sortList: sortList.join(','),
			search,
		});
	} catch (error) {
		console.error('Function getManagerList Error: ', error);
		return res.render('404');
	}
};

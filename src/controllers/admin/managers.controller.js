const { ACCOUNT_TYPES } = require('../../constants/index.constant');
const { Op } = require('../../configs/db.config');
const { Sequelize } = require('sequelize');
const { MAX } = require('../../constants/index.constant');
const Account = require('../../models/account.model');

exports.getManagerList = async (req, res) => {
	try {
		let { page = 1 } = req.query;

		page = Number(page);
		if (isNaN(page) || page < 1) page = 1;

		const managers = await Account.findAndCountAll({
			raw: true,
			attributes: ['username', 'isLocked', 'failedLoginTime'],
			where: {
				accountType: ACCOUNT_TYPES.MANAGER,
			},
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});
		const managerList = managers.rows;

		console.log('page', page);
		console.log('req query', req.query);
		return res.render('./admin/managers/view-list', {
			title: 'Người quản lý | Xem danh sách',
			managerList,
			total: managers.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			sortList: [],
			search: '',
		});
	} catch (error) {
		console.error('Function getManagerList Error: ', error);
		return res.render('404');
	}
};

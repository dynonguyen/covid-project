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
			attributes: ['accountId', 'username', 'isLocked', 'failedLoginTime'],
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

exports.getManager = async (req, res) => {
	const { accountId } = req.params;
	if (!accountId)
		return res.status(404).json({ message: 'Không tìm thấy người quản lý' });

	try {
		const manager = await Account.findOne({
			raw: true,
			attributes: ['username', 'isLocked', 'accountType', 'failedLoginTime'],
			where: { accountId },
			include: [{ model: Account, attributes: [] }],
		});

		if (!manager)
			return res.status(404).json({ message: 'Không tìm thấy người quản lý' });

		return res.status(200).json(manager);
	} catch (error) {
		console.error('Function getManager Error: ', error);
		return res.status(404).json({ message: 'Không tìm thấy người quản lý' });
	}
};

exports.putUpdateIsLocked = async (req, res) => {
	let { accountId, newIsLocked } = req.body;
	console.log('AccountId', accountId);
	try {
		const manager = await Account.findOne({
			raw: true,
			where: { accountId },
		});
		if (!manager) {
			return res
				.status(400)
				.json({ msg: 'Tài khoản người quản lý không tồn tại' });
		}

		// update the account lock status
		await Account.update({ isLocked: newIsLocked }, { where: { accountId } });

		return res.status(200).json({});
	} catch (error) {
		console.error('Function putUpdateIsLocked Error: ', error);
		return res.status(400).json({ msg: 'Cập nhật thất bại !' });
	}
};

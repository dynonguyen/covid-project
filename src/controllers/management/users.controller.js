const {
	convertStatusFToStr,
	getAddressUser,
	parseSortStr,
} = require('../../helpers/index.helpers');
const { MAX } = require('../../constants/index.constant');
const { Sequelize } = require('sequelize');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');
const RelatedUser = require('../../models/related-user.model');
const { Op } = require('../../configs/db.config');

exports.getUserList = async (req, res) => {
	let { page = 1, sort = '', search = '' } = req.query;
	const sortList = parseSortStr(sort);
	const order = sortList.map((i) => i.split(' '));

	page = Number(page);
	if (isNaN(page) || page < 1) page = 1;

	const where = search
		? {
				[Op.or]: [
					{
						fullname: Sequelize.where(
							Sequelize.fn('LOWER', Sequelize.col('fullname')),
							'LIKE',
							`%${search.toLowerCase()}%`
						),
					},
					{ peopleId: { [Op.like]: `%${search}%` } },
				],
		  }
		: {};

	try {
		const users = await User.findAndCountAll({
			raw: true,
			order,
			attributes: [
				'userId',
				'addressId',
				'uuid',
				'fullname',
				'peopleId',
				'DOB',
				'statusF',
				[Sequelize.col('manager.username'), 'manager'],
			],
			where,
			include: [
				{
					model: Account,
					as: 'manager',
					attributes: [],
					required: true,
				},
			],
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});

		for (let user of users.rows) {
			const numOfRelated = await RelatedUser.count({
				where: { originUserId: user.userId },
			});
			const address = await getAddressUser(user.addressId, 5);
			user.numOfRelated = numOfRelated;
			user.address = address;
		}

		return res.render('./management/users/view-list', {
			title: 'Người liên quan Covid | Xem danh sách',
			userList: users.rows,
			total: users.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			sortList: sortList.join(','),
			search,
			helpers: {
				convertStatusFToStr,
			},
		});
	} catch (error) {
		console.error('Function getUserList Error: ', error);
		return res.render('404');
	}
};

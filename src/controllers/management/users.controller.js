const {
	convertStatusFToStr,
	getAddressUser,
} = require('../../helpers/index.helpers');
const { MAX } = require('../../constants/index.constant');
const { Sequelize } = require('sequelize');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');
const RelatedUser = require('../../models/related-user.model');

exports.getUserList = async (req, res) => {
	let { page = 1 } = req.params;

	try {
		const users = await User.findAndCountAll({
			raw: true,
			order: ['fullname'],
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
			include: [
				{
					model: Account,
					as: 'manager',
					attributes: [],
				},
			],
			limit: MAX.PAGE_SIZE,
			offset: 3,
		});

		for (let user of users.rows) {
			const numOfRelated = await RelatedUser.count({
				where: { originUserId: user.userId },
			});
			const address = await getAddressUser(user.addressId, 2);
			user.numOfRelated = numOfRelated;
			user.address = address;
		}

		return res.render('./management/users/view-list', {
			title: 'Người liên quan Covid | Xem danh sách',
			userList: users.rows,
			total: users.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			helpers: {
				convertStatusFToStr,
			},
		});
	} catch (error) {
		console.error('Function getUserList Error: ', error);
		return res.render('404');
	}
};

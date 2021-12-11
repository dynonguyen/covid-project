const {
	convertStatusFToStr,
	getAddressUser,
	parseSortStr,
	omitPropObj,
} = require('../../helpers/index.helpers');
const { MAX } = require('../../constants/index.constant');
const { Sequelize } = require('sequelize');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');
const RelatedUser = require('../../models/related-user.model');
const { Op } = require('../../configs/db.config');
const TreatmentHistory = require('../../models/treatment-history.model');
const IsolationFacility = require('../../models/isolation-facility.model');

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
				'uuid',
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

		const userList = users.rows.map((user) =>
			omitPropObj(user, ['userId', 'addressId'])
		);

		return res.render('./management/users/view-list', {
			title: 'Người liên quan Covid | Xem danh sách',
			userList,
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

exports.getUser = async (req, res) => {
	const { uuid } = req.params;
	if (!uuid)
		return res.status(404).json({ message: 'Không tìm thấy người dùng' });

	try {
		const user = await User.findOne({
			raw: true,
			attributes: {
				exclude: ['uuid', 'managerId', 'accountId'],
				include: [
					[Sequelize.col('manager.username'), 'manager'],
					[Sequelize.col('account.isLocked'), 'isLocked'],
				],
			},
			where: { uuid },
			include: [
				{ model: Account, as: 'manager', attributes: [] },
				{ model: Account, as: 'account', attributes: [] },
			],
		});

		if (!user)
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });

		// Get user's address
		user.address = await getAddressUser(user.addressId);

		// Get related user list
		const relatedList = await RelatedUser.findAll({
			raw: true,
			where: { originUserId: user.userId },
			attributes: [
				[Sequelize.col('related.fullname'), 'fullname'],
				[Sequelize.col('related.peopleId'), 'peopleId'],
				[Sequelize.col('related.DOB'), 'DOB'],
				[Sequelize.col('related.statusF'), 'statusF'],
				[Sequelize.col('related.addressId'), 'addressId'],
				[Sequelize.col('related.createdAt'), 'createdAt'],
				[Sequelize.col('related.userId'), 'userId'],
			],
			include: [{ model: User, as: 'related', attributes: [] }],
		});

		// get the address for each user
		const relatedLen = relatedList.length;
		for (let i = 0; i < relatedLen; ++i) {
			relatedList[i].address = await getAddressUser(relatedList[i].userId);
			relatedList[i] = omitPropObj(relatedList[i], ['userId']);
		}

		// get the user's treatment history
		const treatmentHistories = await TreatmentHistory.findAll({
			raw: true,
			where: { userId: user.userId },
			attributes: [
				'startDate',
				'endDate',
				'statusF',
				[
					Sequelize.col('IsolationFacility.isolationFacilityName'),
					'isolationFacilityName',
				],
			],
			include: {
				model: IsolationFacility,
				attributes: [],
			},
		});

		// omit some field
		const userRes = omitPropObj(user, ['userId', 'addressId']);
		userRes.relatedList = relatedList;
		userRes.treatmentHistories = treatmentHistories;

		return res.status(200).json(userRes);
	} catch (error) {
		console.error('Function getUser Error: ', error);
		return res.status(404).json({ message: 'Không tìm thấy người dùng' });
	}
};

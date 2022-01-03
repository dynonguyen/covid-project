const {
	convertStatusFToStr,
	getAddressUser,
	parseSortStr,
	omitPropObj,
	userValidation,
	addNewAddress,
	createUser,
	addNewTreatmentHistory,
} = require('../../helpers/index.helpers');
const { MAX, STATUS_F } = require('../../constants/index.constant');
const { Op } = require('../../configs/db.config');
const { Sequelize } = require('sequelize');
const Account = require('../../models/account.model');
const Address = require('../../models/address.model');
const IsolationFacility = require('../../models/isolation-facility.model');
const RelatedUser = require('../../models/related-user.model');
const TreatmentHistory = require('../../models/treatment-history.model');
const User = require('../../models/user.model');

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
				[Sequelize.col('account.isLocked'), 'isLocked'],
			],
			include: [{ model: Account, as: 'account', attributes: [] }],
			where,
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});

		for (let user of users.rows) {
			const numOfRelated = await RelatedUser.count({
				where: { originUserId: user.userId },
			});
			const address = await getAddressUser(user.addressId, 5);
			const isolationTreatment = await TreatmentHistory.findOne({
				raw: true,
				attributes: [
					'isolationFacilityId',
					[
						Sequelize.col('IsolationFacility.isolationFacilityName'),
						'isolationFacilityName',
					],
				],
				where: { [Op.and]: [{ userId: user.userId }, { endDate: null }] },
				include: { model: IsolationFacility, attributes: [] },
			});

			user.isolationTreatment = isolationTreatment;
			user.numOfRelated = numOfRelated;
			user.address = address;
		}

		const userList = users.rows.map((user) =>
			omitPropObj(user, ['userId', 'addressId'])
		);

		// get isolation facility list
		if (!req.session.IFList) {
			const IFList = await IsolationFacility.findAll({
				raw: true,
			});
			req.session.IFList = IFList;
		}

		return res.render('./management/users/view-list', {
			userList,
			total: users.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			sortList: sortList.join(','),
			search,
			IFList: req.session.IFList || [],
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

exports.getNewUserForm = async (req, res) => {
	try {
		return res.render('./management/users/new-user.pug');
	} catch (error) {
		console.error('Function getNewUserForm Error: ', error);
		return res.render('404');
	}
};

exports.postNewUser = async (req, res) => {
	const { relatedList = [], ...user } = req.body;

	try {
		const { isValid, msg } = await userValidation(user);
		if (!isValid) {
			return res.status(400).json({ msg });
		}
		const {
			wardId,
			details,
			fullname,
			peopleId,
			DOB,
			isolationFacility,
			statusF,
			related,
		} = user;

		const addressId = await addNewAddress(details, wardId);
		if (!addressId) throw new Error();

		// Get manager Id
		const manager = await Account.findOne({
			raw: true,
			where: { username: req.user.username },
			attributes: ['accountId'],
		});

		// Create origin user
		const newUser = await createUser({
			fullname,
			peopleId,
			DOB,
			statusF,
			addressId,
			managerId: manager.accountId,
		});

		// add treatment history
		const { error, msg: treatmentMsg } = await addNewTreatmentHistory(
			Number(isolationFacility),
			newUser.userId,
			statusF
		);
		if (error) {
			// rollback
			User.destroy({ where: { userId: newUser.userId } });
			Account.destroy({ where: { username: peopleId } });
			Address.destroy({ where: { addressId } });
			return res.status(400).json({ msg: treatmentMsg });
		}

		// add related user if status-f # f0
		if (Number(statusF) !== STATUS_F.F0 && related) {
			// find root user
			const originUser = await User.findOne({
				where: { uuid: related },
				raw: true,
			});
			if (originUser) {
				RelatedUser.create({
					originUserId: originUser.userId,
					relatedUserId: newUser.userId,
				});
			}
		}

		// add related user list f1
		for (const u1 of relatedList) {
			const u1AddressId = await addNewAddress(u1.details, u1.wardId);
			const u1NewUser = await createUser({
				fullname: u1.fullname,
				peopleId: u1.peopleId,
				DOB: u1.DOB,
				statusF: Number(statusF) + 1,
				addressId: u1AddressId,
				managerId: manager.accountId,
			});

			const { error: u1Error, msg: u1TreatmentMsg } =
				await addNewTreatmentHistory(
					Number(u1.isolationFacility),
					u1NewUser.userId,
					statusF + 1
				);
			if (u1Error) {
				User.destroy({ where: { userId: u1NewUser.userId } });
				Address.destroy({ where: { addressId: u1AddressId } });
				return res.status(400).json({ msg: u1TreatmentMsg });
			}

			RelatedUser.create({
				originUserId: newUser.userId,
				relatedUserId: u1NewUser.userId,
			});

			// add related user list f2
			const u1RelatedList = u1.relatedList || [];
			for (const u2 of u1RelatedList) {
				const u2AddressId = await addNewAddress(u2.details, u2.wardId);
				const u2NewUser = await createUser({
					fullname: u2.fullname,
					peopleId: u2.peopleId,
					DOB: u2.DOB,
					statusF: Number(statusF) + 2,
					addressId: u2AddressId,
					managerId: manager.accountId,
				});

				const { error: u2Error, msg: u2TreatmentMsg } =
					await addNewTreatmentHistory(
						Number(u2.isolationFacility),
						u2NewUser.userId,
						statusF + 2
					);
				if (u2Error) {
					User.destroy({ where: { userId: u2NewUser.userId } });
					Address.destroy({ where: { addressId: u2AddressId } });
					return res.status(400).json({ msg: u2TreatmentMsg });
				}

				RelatedUser.create({
					originUserId: u1NewUser.userId,
					relatedUserId: u2NewUser.userId,
				});

				// add related user list f3
				const u3RelatedList = u2.relatedList || [];
				for (const u3 of u3RelatedList) {
					const u3AddressId = await addNewAddress(u3.details, u3.wardId);
					const u3NewUser = await createUser({
						fullname: u3.fullname,
						peopleId: u3.peopleId,
						DOB: u3.DOB,
						statusF: Number(statusF) + 3,
						addressId: u3AddressId,
						managerId: manager.accountId,
					});

					const { error: u3Error, msg: u3TreatmentMsg } =
						await addNewTreatmentHistory(
							Number(u3.isolationFacility),
							u3NewUser.userId,
							statusF + 3
						);
					if (u3Error) {
						User.destroy({ where: { userId: u3NewUser.userId } });
						Address.destroy({ where: { addressId: u3AddressId } });
						return res.status(400).json({ msg: u3TreatmentMsg });
					}

					RelatedUser.create({
						originUserId: u2NewUser.userId,
						relatedUserId: u3NewUser.userId,
					});
				}
			}
		}

		return res.status(200).json({ msg: 'Thêm thành công' });
	} catch (error) {
		console.error('Function postNewUser Error: ', error);
		return res.status(400).json({ msg: 'Thêm thất bại !' });
	}
};

exports.putUpdateUserStatus = async (req, res) => {
	let { uuid, newStatusF, newIF, newIsLocked } = req.body;

	try {
		const user = await User.findOne({ raw: true, where: { uuid } });
		if (!user) {
			return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
		}

		const { statusF, accountId, userId } = user;

		// update the account lock status
		Account.update({ isLocked: newIsLocked }, { where: { accountId } });

		// update treatment history
		if (newIF !== '' && !isNaN(Number(newIF))) {
			newIF = Number(newIF);

			// check capacity
			const isoFac = await IsolationFacility.findOne({
				raw: true,
				where: { isolationFacilityId: newIF },
			});
			if (!isoFac) {
				return res.status(400).json({ msg: 'Khu điều trị không tồn tại' });
			}
			if (isoFac.currentQuantity >= isoFac.capacity) {
				return res.status(400).json({ msg: 'Khu điều trị đã đầy' });
			}

			TreatmentHistory.update(
				{ endDate: new Date() },
				{ where: { userId, endDate: null } }
			);
			TreatmentHistory.create({
				userId,
				isolationFacilityId: newIF,
				startDate: new Date(),
				endDate: null,
				statusF: newStatusF === '' ? statusF : Number(newStatusF),
			});
		}

		// update user status f
		if (newStatusF !== '' && newStatusF > statusF) {
			return res.status(400).json({
				msg: 'Không thể chuyển trạng thái từ cấp cao về cấp thấp hơn',
			});
		}

		if (newStatusF === '') return res.status(200).json({});

		newStatusF = Number(newStatusF);
		if (isNaN(newStatusF)) throw new Error();
		User.update({ statusF: newStatusF }, { where: { userId } });

		if (newStatusF === STATUS_F['Khỏi bệnh']) {
			return res.status(200).json({});
		}

		// Update status for related user
		let relatedList = [];

		let tempList = [userId];
		do {
			let list = [];
			for (let id of tempList) {
				list = [
					...list,
					...((
						await RelatedUser.findAll({
							attributes: ['relatedUserId'],
							raw: true,
							where: { originUserId: id },
						})
					)?.map((u) => u.relatedUserId) || []),
				];
			}

			tempList = [...list];
			relatedList = [...relatedList, ...list];
		} while (tempList && tempList.length > 0);

		relatedList?.forEach((uId) => {
			User.increment({ statusF: -1 }, { where: { userId: uId } });
		});

		return res.status(200).json({});
	} catch (error) {
		console.error('Function putUpdateUserStatus Error: ', error);
		return res.status(400).json({ msg: 'Cập nhật thất bại !' });
	}
};

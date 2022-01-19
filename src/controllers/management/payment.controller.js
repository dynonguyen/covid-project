const AccountHistory = require('../../models/account-history.model');
const Notification = require('../../models/notification.model');
const User = require('../../models/user.model');
const {
	getPaymentLimit,
	putUpdatePaymentLimit: axiosPutUpdatePaymentLimit,
	getUserDebtList,
	getDebtInfo,
} = require('../../payment-api');
const {
	formatCurrency,
	formatDateToStr,
} = require('../../helpers/index.helpers');
const { Op } = require('../../configs/db.config');

exports.getMinimumLimit = async (req, res) => {
	try {
		const { minimumLimit } = await getPaymentLimit();
		return res.render('./management/payment/minimum-limit.pug', {
			minimumLimit,
		});
	} catch (error) {
		console.error('Function getMiniumLimit Error: ', error);
		return res.render('404');
	}
};

exports.getDebtList = async (req, res) => {
	try {
		const debtList = await getUserDebtList();

		// get list of users managed by this manager
		const { accountId } = req.user;
		const managedUsers = await User.findAll({
			raw: true,
			where: {
				managerId: Number(accountId),
			},
			attributes: ['fullname', 'peopleId', 'userId'],
		});

		let managedDebtList = [];
		const date = new Date();
		const [y, m] = [date.getFullYear(), date.getMonth(), date.getDate()];
		const startMonth = new Date(y, m, 1);
		const endMonth = new Date(y, m + 1, 0);

		for (let d of debtList) {
			const u = managedUsers.find((i) => i.userId === d.userId);
			if (u) {
				const isExistRemind = await Notification.count({
					where: {
						userId: u.userId,
						createdTime: {
							[Op.and]: [{ [Op.gte]: startMonth }, { [Op.lt]: endMonth }],
						},
					},
				});

				managedDebtList.push({
					...u,
					...d,
					isRemind: isExistRemind ? true : false,
				});
			}
		}

		return res.render('./management/payment/debt-list.pug', {
			debtList: managedDebtList,
			helpers: {
				formatCurrency,
				formatDateToStr,
			},
		});
	} catch (error) {
		console.error('Function getDebtList Error: ', error);
		return res.render('./management/payment/debt-list.pug', {
			debtList: [],
		});
	}
};

exports.putUpdateMinimumLimit = async (req, res) => {
	const newMiniumLimit = Number(req.body.minimumLimit);
	if (isNaN(newMiniumLimit) || newMiniumLimit < 1 || newMiniumLimit > 25) {
		return res.status(400).json({});
	}

	try {
		const updateResult = await axiosPutUpdatePaymentLimit(newMiniumLimit);
		if (updateResult) {
			const { accountId, username } = req.user;
			await AccountHistory.create({
				accountId: Number(accountId),
				activity: `Tài khoản "${username}" đã cập nhật hạn mức thanh toán tối thiểu thành ${newMiniumLimit}%`,
				createdDate: new Date(),
			});
			return res.status(200).json({});
		}
		return res.status(400).json({});
	} catch (error) {
		console.error('Function putUpdateMiniumLimit Error: ', error);
		return res.status(400).json({});
	}
};

exports.postRemindUserPayDebt = async (req, res) => {
	const userId = Number(req.params.userId);
	try {
		const { minimumLimit } = await getPaymentLimit();
		const debtInfo = await getDebtInfo(userId);
		if (debtInfo && minimumLimit) {
			const { debt, returned, status } = debtInfo;
			if (status === 1 || debt === returned) {
				return res.status(200).json({});
			}

			const remainingDebt = debt - returned;
			await Notification.create({
				userId,
				title: `Nhắc thanh toán dư nợ tháng ${new Date().getMonth() + 1}`,
				content: `Bạn có một khoản dư nợ ${formatCurrency(
					remainingDebt
				)} cần thanh toán. Hạn mức thanh toán tối thiểu phải thanh toán hàng tháng là ${minimumLimit}% số dư nợ còn lại ~ ${formatCurrency(
					~~((remainingDebt * minimumLimit) / 100)
				)}. Chọn tính năng nạp tiền để thanh toán. Cảm ơn.`,
				createdTime: new Date(),
			});
		}
		return res.status(200).json({});
	} catch (error) {
		console.error('Function postRemindUserPayDebt Error: ', error);
		return res.status(400).json({});
	}
};

const {
	formatCurrency,
	formatDateToStr,
	getFirstDayNextMonth,
} = require('../../helpers/index.helpers');
const User = require('../../models/user.model');
const Notification = require('../../models/notification.model');
const Address = require('../../models/address.model');
const Manager = require('../../models/account.model');
const Accounts = require('../../models/account.model');
const {
	getDebtInfo,
	getPaymentLimit,
	getUserBalance,
} = require('../../payment-api');

exports.getUserInfo = async (req, res) => {
	try {
    const {username} = req.user;
    const account = await Accounts.findAll({
      where: {
        username
      },
    })
    const findUser = await User.findOne({
      where: {
        accountId: account[0].accountId
      }
    })
    const address = await Address.findOne({
      where: {
        addressId: findUser.addressId
      }
    })
    const manager = await Accounts.findOne({
      where: {
        accountId: findUser.managerId
      }
    })
		return res.render('./user/info.pug',{
      findUser,
      manager,
      address
    });
	} catch (error) {
		console.error('Function getUserInfo Error: ', error);
		return res.render('404');
	}
};

exports.getManagementHistory = async (req, res) => {
	try {
    console.log('getManagementHistory');
		return res.render('./user/management-history.pug');
	} catch (error) {
		console.error('Function getManagementHistory Error: ', error);
		return res.render('404');
	}
};

exports.getConsumptionHistory = async (req, res) => {
	try {
    console.log('getConsumptionHistory');
		return res.render('./user/consumption-history.pug');
	} catch (error) {
		console.error('Function getConsumptionHistory Error: ', error);
		return res.render('404');
	}
};

exports.getPaymentHistory = async (req, res) => {
	try {
    
		return res.render('./user/payment-history.pug');
	} catch (error) {
		console.error('Function getPaymentHistory Error: ', error);
		return res.render('404');
	}
};

exports.getDebt = async (req, res) => {
	const { accountId } = req.user;

	try {
		const { userId } = await User.findOne({ raw: true, where: { accountId } });
		const debtInfo = await getDebtInfo(userId);
		const paymentLimit = await getPaymentLimit();

		return res.render('./user/debt.pug', {
			debtInfo,
			paymentLimit,
			nextTerm: getFirstDayNextMonth(),
			helpers: {
				formatDateToStr,
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getDebtHistory Error: ', error);
		return res.render('404');
	}
};

exports.getBalance = async (req, res) => {
	const { accountId } = req.user;

	try {
		const { userId } = await User.findOne({ raw: true, where: { accountId } });
		const balance = await getUserBalance(userId);

		return res.render('./user/balance.pug', {
			balance,
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getBalance Error: ', error);
		return res.render('404');
	}
};

exports.getNotification = async (req, res) => {
	const { accountId } = req.user;
	try {
		const { userId } = await User.findOne({ raw: true, where: { accountId } });
		const notifications = await Notification.findAll({
			raw: true,
			where: {
				userId,
			},
			order: [['createdTime', 'DESC']],
		});

		return res.render('./user/notification.pug', {
			notifications,
			helpers: {
				formatDateToStr,
			},
		});
	} catch (error) {
		console.error('Function getNotification Error: ', error);
		return res.render('404');
	}
};

exports.getChangePassword = (req, res) => {
	return res.render('./user/change-password.pug');
};

exports.postChangePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	console.log(req.user.accountId, oldPassword, newPassword);
	try {
	} catch (error) {
		console.error('Function putChangePassword Error: ', error);
		return res.render('404');
	}
};

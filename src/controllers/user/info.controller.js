const {
	formatCurrency,
	formatDateToStr,
	getFirstDayNextMonth,
} = require('../../helpers/index.helpers');
const User = require('../../models/user.model');
const { getDebtInfo, getPaymentLimit } = require('../../payment-api');

exports.getUserInfo = async (req, res) => {
	try {
		return res.render('./user/info.pug');
	} catch (error) {
		console.error('Function getUserInfo Error: ', error);
		return res.render('404');
	}
};

exports.getManagementHistory = async (req, res) => {
	try {
		return res.render('./user/management-history.pug');
	} catch (error) {
		console.error('Function getManagementHistory Error: ', error);
		return res.render('404');
	}
};

exports.getConsumptionHistory = async (req, res) => {
	try {
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

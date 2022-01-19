const AccountHistory = require('../../models/account-history.model');
const {
	getPaymentLimit,
	putUpdatePaymentLimit: axiosPutUpdatePaymentLimit,
} = require('../../payment-api');

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

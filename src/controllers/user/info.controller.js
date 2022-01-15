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

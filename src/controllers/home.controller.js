const { ACCOUNT_TYPES } = require('../constants/index.constant');

exports.getHome = async (req, res) => {
	try {
		const { accountType } = req.user;

		switch (accountType) {
			case ACCOUNT_TYPES.USER:
				return res.send('User page');
			case ACCOUNT_TYPES.MANAGER:
				return res.redirect('/management');
			default:
				return res.render('404');
		}
	} catch (error) {
		console.error('Function getHome Error: ', error);
		return res.render('404');
	}
};

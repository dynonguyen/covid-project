const { ACCOUNT_TYPES } = require('../constants/index.constant');

exports.getHome = (req, res) => {
	try {
		const { accountType } = req.user;

		switch (accountType) {
			case ACCOUNT_TYPES.USER:
				return res.redirect('/user');
			case ACCOUNT_TYPES.MANAGER:
				return res.redirect('/management');
			case ACCOUNT_TYPES.ADMIN:
				return res.redirect('/admin');
			default:
				return res.render('404');
		}
	} catch (error) {
		console.error('Function getHome Error: ', error);
		return res.render('404');
	}
};

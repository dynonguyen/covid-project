const { ACCOUNT_TYPES } = require('../constants/index.constant');
const Account = require('../models/account.model');

exports.checkInitSystemMiddleware = async (req, res, next) => {
	try {
		// Accept next for route = POST /init-system
		if (req.originalUrl === '/init-system' && req.method === 'POST') {
			return next();
		}

		// if checked -> next
		if (req.session.initChecked) {
			return next();
		}

		// check database
		const existAdmin = await Account.count({
			where: { accountType: ACCOUNT_TYPES.ADMIN },
		});
		if (existAdmin === 0) {
			return res.render('init-system.pug');
		}

		req.session.initChecked = true;
		return next();
	} catch (error) {
		console.error('Function checkInitSystemMiddleware Error: ', error);
		return res.render('404');
	}
};

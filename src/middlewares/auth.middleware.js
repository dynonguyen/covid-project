const { ACCOUNT_TYPES } = require('../constants/index.constant');
const Account = require('../models/account.model');

exports.authMiddleware = async (req, res, next) => {
	if (req.session.account) {
		return next();
	}

	// if remember me (logged in user)
	const { username } = req.signedCookies;

	// if cookie not found -> redirect login
	if (!username) return res.redirect('/auth/login');

	try {
		// check account in database
		const account = await Account.findOne({ where: { username }, raw: true });

		// if cookie un invalid -> redirect login
		if (!account) return res.redirect('/auth/login');

		// else next
		req.session.account = { accountType: account.accountType, username };
		return next();
	} catch (error) {
		console.log('Middleware authMidleware Error: ', error);
		return res.render('404');
	}
};

exports.mgmtAuthorizationMiddleware = async (req, res, next) => {
	if (
		req.session.account &&
		req.session.account.accountType === ACCOUNT_TYPES.MANAGER
	)
		return next();
	return res.render('404');
};

exports.userAuthorizationMiddleware = async (req, res, next) => {
	if (
		req.session.account &&
		req.session.account.accountType === ACCOUNT_TYPES.USER
	)
		return next();

	return res.render('404');
};

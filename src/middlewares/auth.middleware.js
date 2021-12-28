const {
	ACCOUNT_TYPES,
	JWT_COOKIE_KEY,
	JWT_SECRET,
} = require('../constants/index.constant');
const Account = require('../models/account.model');
const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	// if remember me (logged in user)
	const jwtToken = req.cookies[JWT_COOKIE_KEY];

	// if cookie not found -> redirect login
	if (!jwtToken) return res.redirect('/auth/login');

	try {
		// verify token
		const decoded = jwt.verify(jwtToken, JWT_SECRET);
		const { accountType, username } = decoded.sub;

		// check account in database
		const account = await Account.findOne({
			where: { username, accountType },
			raw: true,
		});

		// if token invalid -> redirect login
		if (!account) return res.redirect('/auth/login');

		const user = { accountType, username };
		req.login(user, function (err) {
			if (err) {
				return res.redirect('/auth/login');
			}
			return next();
		});
	} catch (error) {
		console.log('Middleware authMiddleware Error: ', error);
		return res.redirect('/auth/login');
	}
};

exports.mgmtAuthorizationMiddleware = async (req, res, next) => {
	if (req.user.accountType === ACCOUNT_TYPES.MANAGER) {
		return next();
	}
	return res.render('404');
};

exports.userAuthorizationMiddleware = async (req, res, next) => {
	if (req.user.accountType === ACCOUNT_TYPES.USER) {
		return next();
	}

	return res.render('404');
};

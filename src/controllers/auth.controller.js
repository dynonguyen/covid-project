const Account = require('../models/account.model');
const { hashPassword, jwtEncode } = require('../helpers/index.helpers');
const passport = require('passport');
const { JWT_COOKIE_KEY, MAX } = require('../constants/index.constant');
require('../middleware/passport.middleware');

exports.getLogin = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	return res.render('login.pug');
};

exports.getLogout = (req, res) => {
	req.logout();
	res.clearCookie(JWT_COOKIE_KEY);
	return res.redirect('/auth/login');
};

exports.postLogin = async (req, res, next) => {
	const { remember = false } = req.body;

	passport.authenticate('local', function (error, user, info) {
		if (error) {
			return res.render('login.pug', {
				message: 'Đăng nhập thất bại, thử lại !',
			});
		}

		if (!user) {
			const { isCreatePwd = false, message, username } = info;
			if (isCreatePwd) {
				return res.render('create-password.pug', {
					username,
				});
			}

			return res.render('login.pug', {
				message,
				username,
			});
		}

		const jwtToken = jwtEncode(user, Boolean(remember));
		req.login(user, function (err) {
			if (err) {
				return res.render('404.pug');
			}

			res.cookie(JWT_COOKIE_KEY, jwtToken, {
				httpOnly: true,
				maxAge: Boolean(remember) ? MAX.TOKEN_EXP : MAX.SESSION_EXP,
			});
			return res.redirect('/');
		});
	})(req, res, next);
};

exports.postCreatePassword = async (req, res) => {
	const { username } = req.params;
	const { password } = req.body;
	try {
		if (username && password) {
			const hashPw = await hashPassword(password);
			await Account.update({ password: hashPw }, { where: { username } });
			return res.redirect('/auth/login');
		}
	} catch (error) {
		console.error('Function postCreatePassword Error: ', error);
		return res.render('404');
	}
};

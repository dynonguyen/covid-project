const bcrypt = require('bcryptjs');
const Account = require('../../models/admin-account.model');
const { MAX } = require('../../constants/index.constant');
const { hashPassword } = require('../../helpers/index.helpers');

exports.getLogin = async (req, res) => {
	try {
		if (req.session.account) {
			return res.redirect('/');
		}

		return res.render('./admin/login', {
			title: 'Đăng nhập Admin',
		});
	} catch (error) {
		console.error('Function getLoginAdmin Error: ', error);
	}
};

exports.getLogout = async (req, res) => {
	try {
		req.session.account = null;
		res.clearCookie('username');
		return res.redirect('/auth-admin/login');
	} catch (error) {
		console.error('Function getAdminLogout Error: ', error);
		return res.render('404');
	}
};

exports.postLogin = async (req, res) => {
	const { username = '', password = '', remember } = req.body;

	try {
		// check if account existence
		const account = await Account.findOne({
			where: { username },
			raw: true,
		});

		// if not exist
		if (!account) {
			return res.render('./admin/login', {
				title: 'Đăng nhập Admin',
				message: 'Tài khoản không tồn tại !',
				username,
			});
		}

		const {
			password: accountPwd,
			failedLoginTime,
			isLocked,
		} = account;

		// The account has been locked
		if (isLocked) {
			return res.render('./admin/login', {
				title: 'Đăng nhập Admin',
				message:
					'Tài khoản admin đã bị khoá !',
				username,
			});
		}
		// else check password
		const isCorrectPwd = await bcrypt.compare(password, accountPwd);

		if (isCorrectPwd) {
			req.session.account = { username };
			if (remember) {
				res.cookie('username', username, {
					signed: true,
					httpOnly: true,
					maxAge: MAX.COOKIE_AGE,
				});
			}
			return res.redirect('/admin');
		}

		// if the password is incorrect
		let message = '';
		if (failedLoginTime < MAX.FAILED_LOGIN_TIME - 1) {
			message = 'Mật khẩu không chính xác';
			await Account.update(
				{ failedLoginTime: failedLoginTime + 1 },
				{ where: { username } }
			);
		} else {
			await Account.update(
				{ failedLoginTime: MAX.FAILED_LOGIN_TIME, isLocked: true },
				{ where: { username } }
			);
			message = `Tài khoản của bạn đã bị khoá do đăng nhập sai quá ${MAX.FAILED_LOGIN_TIME} lần`;
		}

		return res.render('./admin/login', {
			title: 'Đăng nhập Admin',
			message,
			username,
		});
	} catch (error) {
		console.error('Function postLogin Error: ', error);
		return res.render('404');
	}
};

exports.postCreatePassword = async (req, res) => {
	const { username } = req.params;
	const { password } = req.body;
	try {
		if (username && password) {
			const hashPw = await hashPassword(password);
			await Account.update({ password: hashPw }, { where: { username } });
			return res.redirect('/auth-admin/login');
		}
	} catch (error) {
		console.error('Function postCreatePassword Error: ', error);
		return res.render('404');
	}
};

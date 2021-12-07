const bcrypt = require('bcryptjs');
const {
	ACCOUNT_TYPES,
	COOKIE_KEY,
	MAX,
} = require('../constants/index.constant');
const Account = require('../models/account.model');

exports.getLogin = async (req, res) => {
	try {
		if (req.session.account) {
			return res.redirect('/');
		}

		return res.render('login', {
			title: 'Đăng nhập',
		});
	} catch (error) {
		console.error('Function postLogin Error: ', error);
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
			return res.render('login', {
				title: 'Đăng nhập',
				message: 'Tài khoản không tồn tại !',
				username,
			});
		}

		const {
			password: accountPwd,
			accountType,
			failedLoginTime,
			isLocked,
		} = account;

		// The account has been locked
		if (isLocked) {
			return res.render('login', {
				title: 'Đăng nhập',
				message:
					'Tài khoản đã bị khoá, vui lòng liên hệ người quản trị để mở khoá !',
				username,
			});
		}

		// if the account is a default user -> check empty password
		if (accountType === ACCOUNT_TYPES.USER) {
			if (!password) {
				return res.send('Tao mat khau moi');
			}
		}

		// else check password
		const isCorrectPwd = await bcrypt.compare(password, accountPwd);

		if (isCorrectPwd) {
			req.session.account = { accountType, username };
			if (remember) {
				res.cookie('username', username, {
					httpOnly: true,
					signed: true,
					maxAge: MAX.COOKIE_AGE,
				});
			}
			return res.redirect('/');
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
				{ failedLoginTime: failedLoginTime + 1, isLocked: true },
				{ where: { username } }
			);
			message = `Tài khoản của bạn đã bị khoá do đăng nhập sai quá ${MAX.FAILED_LOGIN_TIME} lần`;
		}

		return res.render('login', {
			title: 'Đăng nhập',
			message,
			username,
		});
	} catch (error) {
		console.error('Function postLogin Error: ', error);
		return res.render('404');
	}
};

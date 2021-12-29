const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account.model');
const { ACCOUNT_TYPES, MAX } = require('../constants/index.constant');
const bcrypt = require('bcryptjs');

passport.use(
	new LocalStrategy(async function (username, password, done) {
		try {
			// check if account existence
			const account = await Account.findOne({
				where: { username },
				raw: true,
			});

			// if not exist
			if (!account) {
				return done(null, false, {
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
				return done(null, false, {
					message:
						'Tài khoản đã bị khoá, vui lòng liên hệ người quản trị để mở khoá !',
					username,
				});
			}

			// if the account is a default user -> check empty password
			if (accountType === ACCOUNT_TYPES.USER && !accountPwd) {
				return done(null, false, { isCreatePwd: true, username });
			}

			// else check password
			const isCorrectPwd = await bcrypt.compare(password, accountPwd);

			if (isCorrectPwd) {
				return done(null, { accountType, username });
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

			return done(null, false, {
				message,
				username,
			});
		} catch (error) {
			console.error('PASSPORT LOCAL STRATEGY ERROR: ', error);
			return done(error, false);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(async function (user, done) {
	const { username } = user;
	try {
		const account = await Account.findOne({ where: { username } });
		if (account && !account.isLocked) {
			return done(null, user);
		}

		return done(null, false);
	} catch (error) {
		console.log('PASSPORT DESERIALIZE ERROR: ', error);
		done(error, false);
	}
});

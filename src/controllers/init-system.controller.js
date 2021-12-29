const { ACCOUNT_TYPES } = require('../constants/index.constant');
const { hashPassword } = require('../helpers/index.helpers');
const Account = require('../models/account.model');

exports.postCreateAdminAccount = async (req, res) => {
	const { username, password } = req.body;
	try {
		// check if an admin account exists
		const countAdminAccount = await Account.count({
			where: { accountType: ACCOUNT_TYPES.ADMIN },
		});
		if (countAdminAccount) {
			return res.redirect('/');
		}

		// create an account
		const hashPwd = await hashPassword(password);
		const adminAccount = await Account.create({
			username,
			password: hashPwd,
			accountType: ACCOUNT_TYPES.ADMIN,
		});

		// create successfully
		if (adminAccount) {
			req.session.initChecked = true;
			return res.redirect('/');
		}

		// failed
		return res.render('init-system.pug');
	} catch (error) {
		console.error('Function postCreateAdminAccount Error: ', error);
		return res.render('init-system.pug');
	}
};

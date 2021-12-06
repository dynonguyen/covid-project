const { hashPassword } = require('../helpers/index.helpers');
const AdminAccount = require('../models/admin-account.model');

exports.postCreateAdminAccount = async (req, res) => {
	const { username, password } = req.body;
	try {
		// check if an admin account exists
		const countAdminAccount = await AdminAccount.count({});
		if (countAdminAccount) {
			return res.redirect('/');
		}

		// create an account
		const hashPwd = await hashPassword();
		const adminAccount = await AdminAccount.create({
			username,
			password: hashPwd,
		});

		// create successfully
		if (adminAccount) {
			req.session.initChecked = true;
			return res.redirect('/');
		}

		// failed
		return res.render('init-system.pug', {
			title: 'Khởi tạo hệ thống',
		});
	} catch (error) {
		console.error('Function postCreateAdminAccount Error: ', error);
		return res.render('init-system.pug', {
			title: 'Khởi tạo hệ thống',
		});
	}
};

// chứa các file controller, viết kiểu exports.function như vầy
// Có try {} catch và log lỗi ra !

const { addQuotes } = require('../helpers/index.helper');
const User = require('../models/user.model');

exports.getHome = async (req, res, next) => {
	try {
		const userList = (
			await User.findAll({
				attributes: ['name', 'username'],
			})
		)?.map((u) => ({
			name: u.get('name'),
			username: u.get('username'),
		}));

		return res.render('home', {
			title: 'Trang chủ',
			data: userList ? userList : [],
			helpers: {
				addQuotes,
			},
		});
	} catch (error) {
		console.error('GET HOME ERROR: ', error);
		return res.render('404.pug');
	}
};

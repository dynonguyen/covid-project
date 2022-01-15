exports.getUserInfo = async (req, res) => {
	try {
		return res.render('./user/info.pug');
	} catch (error) {
		console.error('Function getUserInfo Error: ', error);
		return res.render('404');
	}
};

exports.getManagementHistory = async (req, res) => {
	try {
		return res.render('./user/management-history.pug');
	} catch (error) {
		console.error('Function getManagementHistory Error: ', error);
		return res.render('404');
	}
};

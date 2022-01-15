exports.getUserInfo = async (req, res) => {
	try {
		return res.render('./user/info.pug');
	} catch (error) {
		console.error('Function getUserInfo Error: ', error);
		return res.render('404');
	}
};

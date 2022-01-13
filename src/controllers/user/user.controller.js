const { formatCurrency } = require('../../helpers/index.helpers');

exports.getHomePage = async (req, res) => {
	try {
		res.render('user/home.pug', {
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getHomePage Error: ', error);
		return res.render('404');
	}
};

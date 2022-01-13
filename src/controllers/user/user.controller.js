const {
	formatCurrency,
	getPackageList,
	randomFakeDiscount,
} = require('../../helpers/index.helpers');

exports.getHomePage = async (req, res) => {
	try {
		const packageData = await getPackageList(1, 12);
		const { packages } = packageData;

		res.render('user/home.pug', {
			packages,
			helpers: {
				formatCurrency,
				randomFakeDiscount,
				totalPrice: (products = []) =>
					products.reduce((sum, p) => p.productPrice + sum, 0),
			},
		});
	} catch (error) {
		console.error('Function getHomePage Error: ', error);
		return res.render('404');
	}
};

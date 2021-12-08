const ProductPackage = require('../../models/product-package.model');

exports.getProductPackage = async (req, res) => {
	try {
		const packagesList = (await ProductPackage.findAll()).map((p) => ({
			productPackageId: p.get('productPackageId'),
			productPackageName: p.get('productPackageName'),
			limitedProducts: p.get('limitedProducts'),
			limitedInDay: p.get('limitedInDay'),
			limitedInWeek: p.get('limitedInWeek'),
			limitedInMonth: p.get('limitedInMonth'),
		}));

		console.log(packagesList);

		return res.render('product-packages/view', {
			packages: packagesList ? packagesList : [],
		});
	} catch (error) {
		console.error('Load product packages list failed: ', error);
	}
};

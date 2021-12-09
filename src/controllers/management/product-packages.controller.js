const { MAX } = require('../../constants/index.constant');
const ProductPackage = require('../../models/product-package.model');

exports.getProductPackage = async (req, res) => {
	try {
		let { page = 1 } = req.params;

		const packagesList = await ProductPackage.findAll({
			raw: true,
			// order: ['fullname'],
			attributes: [
				'productPackageId',
				'productPackageName',
				'limitedProducts',
				'limitedInDay',
				'limitedInWeek',
				'limitedInMonth',
			],
			limit: MAX.PAGE_SIZE,
			offset: 0,
		});

		return res.render('./management/product-packages/view-list', {
			title: 'Gói sản phẩm | Xem danh sách',
			packages: packagesList,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
		});
	} catch (error) {
		console.error('Load product packages list failed: ', error);
		return res.render('404');
	}
};

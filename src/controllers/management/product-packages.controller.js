const { MAX } = require('../../constants/index.constant');
const ProductInPackage = require('../../models/product-in-package.model');
const ProductPackage = require('../../models/product-package.model');

exports.getProductPackage = async (req, res) => {
	try {
		let { page = 1 } = req.params;

		const packagesList = await ProductPackage.findAndCountAll({
			raw: true,
			order: ['productPackageId'],
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

		// const productInPackageList = await ProductInPackage.findAndCountAll({
		// 	raw: true,
		// 	order: ['productInPackageId'],
		// 	attributes: [
		// 		'productInPackageId',
		// 		'maxQuantity',
		// 		'quantity',
		// 		'productId',
		// 		'productPackageId',
		// 	],
		// 	limit: MAX.PAGE_SIZE,
		// 	offset: 0,
		// 	where: [{ productPackageId: req.params.id }],
		// });

		console.log(req.params);
		console.log(req.body);

		return res.render('./management/product-packages/view-list', {
			title: 'Gói sản phẩm | Xem danh sách',
			total: packagesList.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			packages: packagesList.rows,
		});
	} catch (error) {
		console.error('Load product packages list failed: ', error);
		return res.render('404');
	}
};

const { parseSortStr } = require('../../helpers/index.helpers');

const { Sequelize } = require('sequelize');
const { MAX } = require('../../constants/index.constant');
const { Op } = require('../../configs/db.config');
const ProductInPackage = require('../../models/product-in-package.model');
const ProductPackage = require('../../models/product-package.model');
const Product = require('../../models/product.model');

exports.getProductPackage = async (req, res) => {
	try {
		let { page = 1, sort = '', search = '' } = req.query;
		const sortList = parseSortStr(sort);
		const order = sortList.map((i) => i.split(' '));

		page = Number(page);
		if (isNaN(page) || page < 1) page = 1;

		const where = search
			? {
					[Op.or]: [
						{
							productPackageName: Sequelize.where(
								Sequelize.fn('LOWER', Sequelize.col('productPackageName')),
								'LIKE',
								`%${search.toLowerCase()}%`
							),
						},
					],
			  }
			: {};

		const packagesList = await ProductPackage.findAndCountAll({
			raw: true,
			order,
			attributes: [
				'productPackageId',
				'productPackageName',
				'limitedProducts',
				'limitedInDay',
				'limitedInWeek',
				'limitedInMonth',
			],
			where,
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});

		return res.render('./management/product-packages/view-list', {
			total: packagesList.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			packages: packagesList.rows,
			sortList: sortList.join(','),
			search,
		});
	} catch (error) {
		console.error('Load product packages list failed: ', error);
		return res.render('404');
	}
};

exports.getPackageDetail = async (req, res) => {
	try {
		const { productPackageId } = req.params;
		if (!productPackageId)
			return res
				.status(404)
				.json({ message: 'Không tìm thấy gói nhu yếu phẩm' });

		const productInPackage = await ProductInPackage.findAll({
			raw: true,
			attributes: [
				'maxQuantity',
				'quantity',
				[
					Sequelize.col('ProductPackage.productPackageName'),
					'productPackageName',
				],
				[Sequelize.col('Product.productName'), 'productName'],
				[Sequelize.col('Product.price'), 'price'],
				[Sequelize.col('Product.unit'), 'unit'],
				[Sequelize.col('ProductInPackage.maxQuantity'), 'maxQuantity'],
				[Sequelize.col('ProductInPackage.quantity'), 'quantity'],
			],
			where: { productPackageId },
			include: [
				{ model: ProductPackage, attributes: [] },
				{ model: Product, attributes: [] },
			],
		});

		return res.status(200).json(productInPackage);
	} catch (error) {
		console.error('Load product package detail failed: ', error);
		return res.render('404');
	}
};

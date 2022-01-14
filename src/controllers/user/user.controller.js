const { Sequelize } = require('sequelize');
const {
	formatCurrency,
	getPackageList,
} = require('../../helpers/index.helpers');
const ProductImage = require('../../models/product-image.model');
const ProductInPackage = require('../../models/product-in-package.model');
const ProductPackage = require('../../models/product-package.model');
const Product = require('../../models/product.model');

exports.getHomePage = async (req, res) => {
	const { keyword = '' } = req.query;
	try {
		const packageData = await getPackageList(1, 12, keyword);
		const { packages } = packageData;

		res.render('user/home.pug', {
			packages,
			searchKeyword: keyword,
			helpers: {
				formatCurrency,
				totalPrice: (products = []) =>
					products.reduce((sum, p) => p.productPrice + sum, 0),
			},
		});
	} catch (error) {
		console.error('Function getHomePage Error: ', error);
		return res.render('404');
	}
};

exports.getPackageDetail = async (req, res) => {
	const { packageId } = req.params;
	try {
		let package = {},
			products = [];
		const promises = [];
		const productPhotoPromises = [];

		promises.push(
			ProductPackage.findOne({
				raw: true,
				where: { productPackageId: packageId },
				attributes: { exclude: ['productPackageId', 'limitedProducts'] },
			}).then((data) => (package = { ...data }))
		);

		promises.push(
			ProductInPackage.findAll({
				raw: true,
				attributes: [
					'maxQuantity',
					'productId',
					[Sequelize.col('Product.productName'), 'productName'],
					[Sequelize.col('Product.price'), 'productPrice'],
					[Sequelize.col('Product.unit'), 'productUnit'],
				],
				where: {
					productPackageId: packageId,
				},
				include: {
					model: Product,
					attributes: [],
				},
			}).then((data) => {
				products = [...data];
				data.forEach((p) =>
					productPhotoPromises.push(
						ProductImage.findAll({
							raw: true,
							where: { productId: p.productId },
							attributes: ['src'],
							order: [['isThumbnail', 'DESC']],
							limit: 6,
						}).then((photos) => {
							p.thumbnail = photos[0];
							p.photos = [...photos.slice(1).map((i) => i.src)];
						})
					)
				);
			})
		);

		await Promise.all(promises);
		await Promise.all(productPhotoPromises);

		return res.render('./user/package-detail.pug', {
			package,
			products,
			totalPrice: products.reduce((sum, p) => sum + p.productPrice, 0),
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getPackageDetail Error: ', error);
		return res.render('404');
	}
};

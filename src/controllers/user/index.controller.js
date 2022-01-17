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
	let {
		keyword = '',
		sortByPrice = -1,
		sortByName = -1,
		priceFrom = 0,
		priceTo = 0,
	} = req.query;

	sortByName = parseInt(sortByName);
	if (isNaN(sortByName)) {
		sortByName = -1;
	}

	sortByPrice = parseInt(sortByPrice);
	if (isNaN(sortByPrice)) {
		sortByPrice = -1;
	}

	priceFrom = parseInt(priceFrom);
	if (isNaN(priceFrom)) {
		priceFrom = 0;
	}

	priceTo = parseInt(priceTo);
	if (isNaN(priceTo)) {
		priceTo = 0;
	}

	if (priceFrom > priceTo && priceTo !== 0) {
		[priceFrom, priceTo] = [priceTo, priceFrom];
	}

	try {
		const packageData = await getPackageList(1, 12, {
			keyword,
			sortByName,
			sortByPrice,
			priceFrom,
			priceTo,
		});
		const { packages } = packageData;

		res.render('user/home.pug', {
			packages,
			searchKeyword: keyword,
			sortByPrice,
			sortByName,
			priceFrom,
			priceTo,
			helpers: {
				formatCurrency,
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

		console.log('product package id ', req.params);

		await Promise.all(promises);
		await Promise.all(productPhotoPromises);

		return res.render('./user/package-detail.pug', {
			package,
			products,
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getPackageDetail Error: ', error);
		return res.render('404');
	}
};

exports.getCart = async (req, res) => {
	const cart = JSON.parse(req.cookies.cart) || [];

	try {
		const packages = [];
		const packagePromises = [];
		const productPromises = [];

		cart.forEach((packageId) => {
			packagePromises.push(
				ProductPackage.findOne({
					raw: true,
					where: { productPackageId: packageId },
				}).then((package) => {
					productPromises.push(
						ProductInPackage.findAll({
							raw: true,
							where: {
								productPackageId: packageId,
							},
							attributes: [
								'maxQuantity',
								'productInPackageId',
								'productId',
								[Sequelize.col('Product.productName'), 'productName'],
								[Sequelize.col('Product.price'), 'productPrice'],
								[Sequelize.col('Product.unit'), 'productUnit'],
							],
							include: {
								model: Product,
								attributes: [],
							},
						}).then((products) => {
							package.products = products;
							packages.push(package);
						})
					);
				})
			);
		});

		await Promise.all(packagePromises);
		await Promise.all(productPromises);

		return res.render('./user/cart.pug', {
			packages,
			paymentTotal: packages.reduce((sum, p) => sum + p.totalPrice, 0),
			packagesStr: JSON.stringify(packages),
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getCart Error: ', error);
		return res.render('./user/cart.pug', {
			packages: [],
			packagesStr: '[]',
			helpers: {
				formatCurrency,
			},
		});
	}
};

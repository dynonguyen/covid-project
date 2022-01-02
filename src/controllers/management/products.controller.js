const { formatCurrency } = require('../../helpers/index.helpers');
const ProductImage = require('../../models/product-image.model');
const Product = require('../../models/product.model');
const { Op } = require('../../configs/db.config');
const { Sequelize } = require('sequelize');
const {
	uploadProductPhoto,
	deleteProductPhoto,
	cloudinaryOptimize,
} = require('../../helpers/upload.helper');

function generateProductQuery(query) {
	let {
		search = '',
		sortByName = -1,
		sortByPrice = -1,
		priceFrom,
		priceTo,
	} = query;

	let result = {};
	result.where = {};
	result.order = [];

	if (search) {
		result.where = {
			productName: Sequelize.where(
				Sequelize.fn('LOWER', Sequelize.col('productName')),
				'LIKE',
				`%${search.toLowerCase()}%`
			),
		};
	}

	if (priceFrom) {
		result.where = {
			...result.where,
			price: {
				[Op.gte]: priceFrom,
			},
		};
	}
	if (priceTo) {
		result.where = {
			...result.where,
			price: {
				[Op.lte]: priceTo,
			},
		};
	}

	if (sortByPrice !== -1) {
		if (sortByPrice === 0) {
			result.order.push(['price', 'DESC']);
		} else {
			result.order.push(['price']);
		}
	}

	if (sortByName !== -1) {
		if (sortByName === 0) {
			result.order.push(['productName', 'DESC']);
		} else {
			result.order.push(['productName']);
		}
	}

	return result;
}

exports.getProductList = async (req, res) => {
	let {
		page = 1,
		search = '',
		sortByName = -1,
		sortByPrice = -1,
		priceFrom,
		priceTo,
	} = req.query;

	page = parseInt(page);
	if (isNaN(page)) {
		page = 1;
	}
	const pageSize = 10;

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
		const products = await Product.findAndCountAll({
			raw: true,
			limit: pageSize,
			offset: (page - 1) * pageSize,
			...generateProductQuery({
				search,
				sortByName,
				sortByPrice,
				priceFrom,
				priceTo,
			}),
		});

		const total = products.count;
		const productList = products.rows;

		if (productList.length > 0) {
			// Get product photos
			const promises = [];
			for (let p of productList) {
				promises.push(
					ProductImage.findAll({
						raw: true,
						attributes: { exclude: ['productImageId'] },
						order: [['isThumbnail', 'DESC']],
						where: {
							productId: p.productId,
						},
					}).then((proImgList) => {
						const thumbnail =
							proImgList.find((i) => i.isThumbnail === true)?.src ||
							proImgList[0].src;
						p.thumbnail = cloudinaryOptimize(thumbnail, 'w_350,h_150,q_80');

						p.photos = [
							...proImgList
								.slice(1, 6)
								.map((i) => cloudinaryOptimize(i.src, 'w_50,h_50,q_80')),
						];
					})
				);
			}
			await Promise.all(promises);
		}

		return res.render('./management/products/view-list.pug', {
			total,
			currentPage: page,
			pageSize: pageSize,
			products: productList,
			search,
			sortByName,
			sortByPrice,
			priceFrom,
			priceTo,
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getProductList Error: ', error);
		return res.render('./management/products/view-list.pug', {
			total: 0,
			page: 1,
			pageSize: 0,
			products: [],
		});
	}
};

exports.getNewProduct = (req, res) => {
	return res.render('./management/products/new-product.pug');
};

exports.postNewProduct = async (req, res) => {
	let { productName, price, unit } = req.body;
	const { thumbnail = [], photos = [] } = req.files;

	price = Number(price);
	if (isNaN(price) || !price) {
		return res.render('./management/products/new-product.pug', {
			productName,
			msg: 'Vui lòng nhập giá sản phẩm',
		});
	}

	if (!thumbnail || thumbnail.length === 0 || !photos || photos.length === 0) {
		return res.render('./management/products/new-product.pug', {
			productName,
			msg: 'Vui lòng thêm hình ảnh cho sản phẩm',
		});
	}

	try {
		// check product existence
		const isProdExist = await Product.findOne({
			raw: true,
			attributes: ['productId'],
			where: {
				productName: Sequelize.where(
					Sequelize.fn('LOWER', Sequelize.col('productName')),
					productName.toLowerCase()
				),
			},
		});

		if (isProdExist) {
			return res.render('./management/products/new-product.pug', {
				productName,
				msg: 'Sản phẩm đã tồn tại',
			});
		}

		// Create a product
		const product = await Product.create({
			productName,
			price,
			unit,
		});

		if (!product) {
			throw new Error('Failed to create a product');
		}

		const { productId } = product;

		// upload image
		const promises = [];

		promises.push(
			uploadProductPhoto(
				thumbnail[0],
				`${productId}_thumbnail`,
				productId,
				true
			)
		);

		photos.forEach((photo, index) => {
			promises.push(
				uploadProductPhoto(photo, `${productId}_${index + 1}`, productId, false)
			);
		});

		await Promise.all(promises);
		return res.render('./management/products/new-product.pug', {
			productName,
			isSuccess: true,
			msg: 'Thêm sản phẩm thành công',
		});
	} catch (error) {
		console.error('Function postNewProduct Error: ', error);
		return res.render('./management/products/new-product.pug', {
			productName,
			msg: 'Thêm sản phẩm thất bại ! Thử lại',
		});
	}
};

exports.deleteProduct = async (req, res) => {
	const productId = parseInt(req.params.productId);
	if (!productId || isNaN(productId)) {
		return res.status(400).json({});
	}

	try {
		const nRowAffected = await Product.destroy({
			where: { productId },
			cascade: true,
		});
		deleteProductPhoto(productId);

		if (nRowAffected) {
			return res.status(200).json({});
		}

		return res.status(409).json({});
	} catch (error) {
		console.error('Function deleteProduct Error: ', error);
		return res.status(409).json({});
	}
};

exports.putUpdateProductInfo = async (req, res) => {
	const productId = parseInt(req.params.productId);
	const { name, price, unit } = req.body;

	if (!productId || isNaN(productId)) {
		return res.status(400).json({});
	}

	try {
		const updateRes = await Product.update(
			{ productName: name, price, unit },
			{ where: { productId } }
		);

		if (updateRes) {
			return res.status(200).json({ msg: 'successfully' });
		}

		return res.status(400).json({});
	} catch (error) {
		console.error('Function putUpdateProductInfo Error: ', error);
		return res.status(400).json({});
	}
};

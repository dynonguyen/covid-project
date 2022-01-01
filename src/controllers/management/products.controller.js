const { formatCurrency } = require('../../helpers/index.helpers');
const ProductImage = require('../../models/product-image.model');
const Product = require('../../models/product.model');

exports.getProductList = async (req, res) => {
	let { page = 1 } = req.query;
	page = parseInt(page);
	if (isNaN(page)) {
		page = 1;
	}

	const pageSize = 8;

	try {
		const products = await Product.findAndCountAll({
			raw: true,
			limit: pageSize,
			offset: (page - 1) * pageSize,
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
						p.thumbnail =
							proImgList.find((i) => i.isThumbnail === true)?.src ||
							proImgList[0].src;
						p.photos = [...proImgList.map((i) => i.src)];
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

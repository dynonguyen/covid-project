const { parseSortStr } = require('../../helpers/index.helpers');

const { Sequelize } = require('sequelize');
const { MAX } = require('../../constants/index.constant');
const { Op } = require('../../configs/db.config');
const ProductInPackage = require('../../models/product-in-package.model');
const ProductPackage = require('../../models/product-package.model');
const Products = require('../../models/product.model');
const ProductsImg = require('../../models/product-image.model')

class Product {
  getAllProducts = async(req, res) => {
    const result = await Products.findAll({
      include: [{
        model: ProductsImg
      }]
    })
    return res.render('products', {result})
  }
}

module.exports = new Product();

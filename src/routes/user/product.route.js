const productuserRoute = require('express').Router();
const productuserController = require('../../controllers/user/product.controller');
productuserRoute.get("/get-all-product", productuserController.getAllProducts);

module.exports = productuserRoute;


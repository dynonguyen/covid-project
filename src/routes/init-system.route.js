const initSystemRoute = require('express').Router();
const initSystemController = require('../controllers/init-system.controller');

initSystemRoute.post('/', initSystemController.postCreateAdminAccount);

module.exports = initSystemRoute;

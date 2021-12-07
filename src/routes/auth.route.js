const authRoute = require('express').Router();
const authController = require('../controllers/auth.controller');

authRoute.get('/login', authController.getLogin);

authRoute.post('/login', authController.postLogin);
authRoute.post('/create-password/:username', authController.postCreatePassword);

module.exports = authRoute;

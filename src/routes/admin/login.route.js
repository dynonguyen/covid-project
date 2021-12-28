const loginAdminRoute = require('express').Router();
const loginAdminController = require('../../controllers/admin/login.controller');

loginAdminRoute.get('/login', loginAdminController.getLogin);
loginAdminRoute.get('/logout', loginAdminController.getLogout);

loginAdminRoute.post('/login', loginAdminController.postLogin);
loginAdminRoute.post('/create-password/:username', loginAdminController.postCreatePassword);

module.exports = loginAdminRoute;


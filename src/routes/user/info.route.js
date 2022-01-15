const userInfoRoute = require('express').Router();
const userInfoController = require('../../controllers/user/info.controller');

userInfoRoute.get('/', userInfoController.getUserInfo);

module.exports = userInfoRoute;

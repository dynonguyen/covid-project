const userMgmtRoute = require('express').Router();
const userMgmtController = require('../../controllers/management/users.controller');

userMgmtRoute.get('/list', userMgmtController.getUserList);
userMgmtRoute.get('/new', userMgmtController.getNewUserForm);
userMgmtRoute.get('/:uuid', userMgmtController.getUser);

userMgmtRoute.post('/new', userMgmtController.postNewUser);
userMgmtRoute.put('/update', userMgmtController.putUpdateUserStatus);

module.exports = userMgmtRoute;

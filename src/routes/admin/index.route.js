const iltFactAdminRoute = require('./isolation-facilities.route');
const managerAdminRoute = require('./managers.route');
const adminRoute = require('express').Router();

adminRoute.get('/', (req, res) => res.redirect('/admin/managers/list'));
adminRoute.use('/managers', managerAdminRoute);
adminRoute.use('/isolation-facilities', iltFactAdminRoute);

module.exports = adminRoute;

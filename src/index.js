require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { db } = require('./configs/db.config');
const session = require('express-session');

/* ============== Import middlewares =============== */
const {
	checkInitSystemMiddleware,
} = require('./middlewares/init-system.middleware');
const {
	authMiddleware,
  authAdminMiddleware,
  adminAuthorizationMiddleware,
	mgmtAuthorizationMiddleware,
} = require('./middlewares/auth.middleware');
const { passSidebarStatus } = require('./middlewares/mgmt-session.middleware');

/* ============== Import routes =============== */
const loginRoute = require('./routes/admin/login.route');
const adminRoute = require('./routes/admin/index.route');
const authRoute = require('./routes/auth.route');
const initSystemRoute = require('./routes/init-system.route');
const homeRoute = require('./routes/home.route');
const managementRoute = require('./routes/management/index.route');
const apiRoute = require('./routes/api.route');

/* ============== Config =============== */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '5MB' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE || 'signed_cookie'));
app.use(
	session({
		secret: process.env.SESSION_SERECT || 'session_secret',
		resave: false,
		saveUninitialized: true,
	})
);

// set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set logging
app.use(morgan('tiny'));

/* ============== Global Middlewares =============== */
app.use(checkInitSystemMiddleware);

/* ============== Routes =============== */
app.use('/init-system', initSystemRoute);
app.use('/auth-admin', loginRoute);
app.use('/auth', authRoute);
app.use('/api', apiRoute);
app.use(
	'/admin',
	authAdminMiddleware,
  adminAuthorizationMiddleware,
	passSidebarStatus,
	adminRoute
);

app.use(
	'/management',
	authMiddleware,
	mgmtAuthorizationMiddleware,
	passSidebarStatus,
	managementRoute
);

app.use('/', authMiddleware, authAdminMiddleware, homeRoute);

// 404 Not found redirect
app.use((req, res) => res.render('404.pug'));

/* ============== Listening =============== */
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 3000);

db.sync({ after: true }).then((_) => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
});

require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { db } = require('./configs/db.config');
const session = require('express-session');
const passport = require('passport');

/* ============== Import middlewares =============== */
const {
	checkInitSystemMiddleware,
} = require('./middlewares/init-system.middleware');
const {
	authMiddleware,
	mgmtAuthorizationMiddleware,
} = require('./middlewares/auth.middleware');
const { passSidebarStatus } = require('./middlewares/mgmt-session.middleware');

/* ============== Import routes =============== */
const authRoute = require('./routes/auth.route');
const initSystemRoute = require('./routes/init-system.route');
const homeRoute = require('./routes/home.route');
const managementRoute = require('./routes/management/index.route');
const apiRoute = require('./routes/api.route');
const { MAX } = require('./constants/index.constant');
const { unlessRoute } = require('./middlewares/unless.middleware');

/* ============== Config =============== */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '5MB' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE || 'signed_cookie'));
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'session_secret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: MAX.SESSION_EXP,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

// set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set logging
app.use(morgan('tiny'));

/* ============== Global Middleware =============== */
app.use(unlessRoute([], checkInitSystemMiddleware));
app.use(unlessRoute(['/auth', '/init-system'], authMiddleware));

/* ============== Routes =============== */
app.use('/init-system', initSystemRoute);
app.use('/auth', authRoute);
app.use('/api', apiRoute);
app.use(
	'/management',
	mgmtAuthorizationMiddleware,
	passSidebarStatus,
	managementRoute
);
app.use('/', homeRoute);

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

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

/* ============== Import routes =============== */
const initSystemRoute = require('./routes/inti-system.route');

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
		cookie: { secure: true },
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

// 404 Not found redirect
app.use((req, res) => res.render('404.pug'));

/* ============== Listening =============== */
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 3000);

db.sync({ alter: true }).then((_) => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
});

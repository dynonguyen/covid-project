const jwt = require('jsonwebtoken');
const {
	PAYMENT_SYS_AUTH_PRIVATE_KEY,
	PAYMENT_SYS_URL,
	PAYMENT_TRACKING_QUERY_KEY,
} = require('../../constants/index.constant');

exports.getPutMoney = (req, res) => {
	const { userId } = req.user;

	let callbackUrl = '';
	if (process.env.NODE_ENV?.trim() === 'development') {
		callbackUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/user/info/balance`;
	} else {
		callbackUrl = `${req.protocol}://${req.hostname}/user/info/balance`;
	}

	const token = jwt.sign(
		{
			issuer: 'Covid Project',
			iat: Date.now(),
			sub: {
				userId,
				callbackUrl,
			},
		},
		PAYMENT_SYS_AUTH_PRIVATE_KEY,
		{ expiresIn: 30 * 60 }
	);

	return res.redirect(
		`${PAYMENT_SYS_URL}/auth/login?${PAYMENT_TRACKING_QUERY_KEY}=${token}`
	);
};

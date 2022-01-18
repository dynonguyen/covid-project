module.exports = {
	ACCOUNT_TYPES: {
		USER: 0,
		MANAGER: 1,
		ADMIN: 2,
	},

	DEFAULT: {
		USER_DOB: '1970-01-01',
	},

	MAX: {
		FAILED_LOGIN_TIME: 5,
		PAGE_SIZE: 6,
		TOKEN_EXP: 259_200_000, // 3 days
		SESSION_EXP: 1_800_000, // 30 mins
	},

	PAYMENT_TYPES: {
		CONSUME: 0,
		SEND_MONEY: 1,
	},

	STATUS_F: {
		'Khỏi bệnh': -1,
		F0: 0,
		F1: 1,
		F2: 2,
		F3: 3,
	},

	JWT_SECRET: process.env.JWT_SECRET || 'JWT_Covid_Project',
	JWT_AUTHOR: 'Covid Project System',
	JWT_COOKIE_KEY: 'access_token',

	CLOUDINARY_FOLDER: 'covid-project',
	CLOUDINARY_UPLOAD_PRESET: 'ml_default',

	PAYMENT_SYS_URL: process.env.PAYMENT_URL,
	PAYMENT_SYS_AUTH_HEADER: 'covid-token',
	PAYMENT_SYS_AUTH_PRIVATE_KEY: process.env.PAYMENT_PRIVATE_KEY,
	PAYMENT_TRACKING_QUERY_KEY: 'fid',
	API_AUTH_HEADER: 'covid-token',
};

module.exports = {
	ACCOUNT_TYPES: {
		USER: 0,
		MANAGER: 1,
	},

	DEFAULT: {
		USER_DOB: '1970-01-01',
	},

	MAX: {
		FAILED_LOGIN_TIME: 5,
		COOKIE_AGE: 259_200_000, // 3 days
		PAGE_SIZE: 6,
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
		F4: 4,
		F5: 5,
	},
};

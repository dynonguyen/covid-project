const axios = require('axios').default;
const https = require('https');
const {
	PAYMENT_SYS_URL,
	PAYMENT_SYS_AUTH_HEADER,
	PAYMENT_SYS_AUTH_PRIVATE_KEY,
} = require('../constants/index.constant');

const axiosPayment = axios.create({
	baseURL: PAYMENT_SYS_URL,
	headers: {
		'Content-Type': 'application/json',
		[PAYMENT_SYS_AUTH_HEADER]: PAYMENT_SYS_AUTH_PRIVATE_KEY,
	},
	withCredentials: true,
	paramsSerializer: (params) => queryString.stringify(params),
});

axiosPayment.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		throw error;
	}
);

axiosPayment.interceptors.response.use(
	(res) => {
		return res;
	},
	(error) => {
		throw error;
	}
);

module.exports = axiosPayment;

const axiosPayment = require('../configs/axios.config');

const BASE_URL = '/api';

exports.createPaymentAccount = async (userInfo) => {
	const { username, userId } = userInfo;
	try {
		const apiRes = await axiosPayment.post(`${BASE_URL}/create-account`, {
			username,
			userId,
		});
		if (apiRes.status === 201) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('Function createAccount Payment Error: ', error);
		return false;
	}
};

exports.getDebtInfo = async (userId) => {
	if (!userId) return null;
	try {
		const apiRes = await axiosPayment.get(`${BASE_URL}/debt-info/${userId}`);
		return apiRes?.data?.debtInfo;
	} catch (error) {
		console.error('Function getDebtInfo Error: ', error);
		throw error;
	}
};

exports.getPaymentLimit = async () => {
	try {
		const apiRes = await axiosPayment.get(`${BASE_URL}/payment-limit`);
		return apiRes?.data?.paymentLimit;
	} catch (error) {
		console.error('Function getPaymentLimit Error: ', error);
		throw error;
	}
};

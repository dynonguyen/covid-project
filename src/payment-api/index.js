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

exports.getUserBalance = async (userId) => {
	try {
		const apiRes = await axiosPayment.get(`${BASE_URL}/balance/${userId}`);
		return apiRes?.data?.balance;
	} catch (error) {
		console.error('Function getUserBalance Error: ', error);
		throw error;
	}
};

exports.getUserDebtList = async () => {
	try {
		const apiRes = await axiosPayment.get(`${BASE_URL}/debt-list`);
		return apiRes?.data?.debtList;
	} catch (error) {
		console.log('Function getUserDebtList ERROR: ', error);
		throw error;
	}
};

exports.putUpdatePaymentLimit = async (minimumLimit = 1) => {
	try {
		await axiosPayment.put(`${BASE_URL}/minium-limit`, {
			minimumLimit,
		});
		return true;
	} catch (error) {
		console.error('Function putUpdatePaymentLimit Error: ', error);
		throw error;
	}
};

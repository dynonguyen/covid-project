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

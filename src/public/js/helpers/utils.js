const formatCurrency = (money = 0) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(money);
};

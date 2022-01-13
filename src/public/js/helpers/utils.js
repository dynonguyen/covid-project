const formatCurrency = (money = 0) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(money);
};

const getCart = () => {
	const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
	return cart;
};

const checkPackageInCart = (packageId) => {
	const cart = getCart();
	return cart.includes(packageId);
};

const addToCart = (packageId) => {
	const cart = getCart();
	const isExist = checkPackageInCart(packageId);

	if (!isExist) {
		cart.push(packageId);
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
		$('#cartTotal').removeClass('d-none').text(cart.length);
	}
};

const loadCart = () => {
	const cart = getCart();
	if (cart && cart.length) {
		$('#cartTotal').removeClass('d-none').text(cart.length);
	}
};

const checkCartAddedBtn = () => {
	const cart = getCart();
	cart.forEach((id) =>
		$(`.add-cart-btn[data-id="${id}"]`)
			.addClass('disabled')
			.removeClass('btn-primary')
			.addClass('disabled btn-success')
			.html('Đã thêm <i class="bi bi-cart-check"></i>')
	);
};

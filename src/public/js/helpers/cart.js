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
			.removeClass('btn-primary add-cart-btn')
			.addClass('btn-danger remove-cart-btn')
			.html('Xoá khỏi giỏ hàng <i class="bi bi-cart-dash-fill"></i>')
	);
};

const removeCartItem = (packageId) => {
	const cart = getCart()?.filter((i) => i != packageId);
	console.log(cart);
	localStorage.setItem(CART_KEY, JSON.stringify(cart));

	if (cart.length === 0) {
		$('#cartTotal').addClass('d-none');
	} else {
		$('#cartTotal').text(cart.length);
	}
};

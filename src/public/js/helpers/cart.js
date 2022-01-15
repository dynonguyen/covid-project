function setCookie(name, value, expDay) {
	const d = new Date();
	d.setTime(d.getTime() + expDay * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

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
		setCookie('cart', JSON.stringify(cart), 1);
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
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	setCookie('cart', JSON.stringify(cart), 1);

	if (cart.length === 0) {
		$('#cartTotal').addClass('d-none');
	} else {
		$('#cartTotal').text(cart.length);
	}
};

const removeAllCartItems = () => {
	localStorage.setItem(CART_KEY, JSON.stringify([]));
	setCookie('cart', JSON.stringify([]), 1);
};

(function () {
	if (packages && packages.length > 0) {
		packages = packages.map((p) => ({
			productPackageId: p.productPackageId,
			totalPrice: p.totalPrice,
			products: p.products.map((item) => ({
				productInPackageId: item.productInPackageId,
				productId: item.productId,
				productPrice: item.productPrice,
				maxQuantity: item.maxQuantity,
				quantity: 1,
			})),
		}));
	}
})();

function updatePaymentTotal(newTotal) {
	paymentTotal = newTotal;
	$('#paymentTotal').text(formatCurrency(newTotal));
}

function getPackage(packageId) {
	return packages.find((p) => p.productPackageId === packageId);
}

function getProduct(packageId, productInPackageId) {
	const package = getPackage(packageId);
	return package.products?.find(
		(p) => p.productInPackageId === productInPackageId
	);
}

function removePackage(packageId) {
	const package = getPackage(packageId);
	updatePaymentTotal(paymentTotal - package.totalPrice);
	packages = packages.filter((p) => p.productPackageId !== packageId);

	if (packages.length === 0) return location.reload();

	$(`.package-box[data-id="${packageId}"]`).remove();
	$('.total-package').text(packages.length);
}

function updatePackageTotalPrice(packageId, changedTotal) {
	const package = getPackage(packageId);
	if (package) {
		package.totalPrice += changedTotal;
		$(`.package-box[data-id="${packageId}"] .total-price`).text(
			formatCurrency(package.totalPrice)
		);
	}
}

function updateProductQuantity(packageId, productInPackageId, isPlus = false) {
	const product = getProduct(packageId, productInPackageId);

	if (product) {
		const { maxQuantity, quantity, productPrice } = product;
		if (isPlus && quantity === maxQuantity) return;
		if (!isPlus && quantity === 1) return;

		if (isPlus) {
			product.quantity++;
			updatePackageTotalPrice(packageId, productPrice);
			updatePaymentTotal(paymentTotal + productPrice);

			$(`.quantity-icon.minus[data-id="${productInPackageId}"]`).removeClass(
				'd-none'
			);
			product.quantity === maxQuantity &&
				$(`.quantity-icon.plus[data-id="${productInPackageId}"]`).addClass(
					'd-none'
				);
		} else {
			product.quantity--;
			updatePackageTotalPrice(packageId, -1 * productPrice);
			updatePaymentTotal(paymentTotal - productPrice);

			$(`.quantity-icon.plus[data-id="${productInPackageId}"]`).removeClass(
				'd-none'
			);
			product.quantity === 1 &&
				$(`.quantity-icon.minus[data-id="${productInPackageId}"]`).addClass(
					'd-none'
				);
		}

		$(`.quantity[data-id="${productInPackageId}"]`).text(product.quantity);
	}
}

$(document).ready(function () {
	loadCart();

	$('.remove-package').on('click', function () {
		const packageId = Number($(this).attr('data-id'));
		removeCartItem(packageId);
		removePackage(packageId);
	});

	$('#removeAll').on('click', function () {
		removeAllCartItems();
		location.reload();
	});

	$('.quantity-icon.plus').on('click', function () {
		const packageId = Number($(this).attr('data-package-id'));
		const productInPackageId = Number($(this).attr('data-id'));
		updateProductQuantity(packageId, productInPackageId, true);
	});

	$('.quantity-icon.minus').on('click', function () {
		const packageId = Number($(this).attr('data-package-id'));
		const productInPackageId = Number($(this).attr('data-id'));
		updateProductQuantity(packageId, productInPackageId, false);
	});

	$('#paymentBtn').on('click', async function () {
		$(this).addClass('disabled');

		const paymentRes = await fetch('/user/payment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				carts: {
					paymentTotal,
					packages,
				},
			}),
		});

		if (paymentRes.status === 200) {
			showToastMsg(
				$('#toastMsg'),
				'Đặt hàng thành công, chúng tôi sẽ gửi đến bạn trong thời gian sớm nhất. Xin Cảm ơn',
				'success',
				3000
			);
			removeAllCartItems();
			$('body').addClass('disabled');
			setTimeout(() => {
				location.href = '/user/info/payment-history';
			}, 3000);
		} else if (paymentRes.status === 406) {
			$(this).removeClass('disabled');
		} else {
			showToastMsg(
				$('#toastMsg'),
				'Đặt hàng thất bại, thử lại sau. Xin cảm ơn',
				'danger',
				3000
			);
			$(this).removeClass('disabled');
		}
	});
});

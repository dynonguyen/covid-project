const ROOT_URL = '/management/products';
let photoSlides = [];
let currentSlide = 0;

function formatCurrency(money = 0) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(money);
}

function getProductCardInfo(productId) {
	const product = {};
	const productCard = $(`.product-card[data-id="${productId}"]`);

	product.name = productCard.find('.product-name').text()?.trim();
	product.price = productCard.find('.price').attr('data-price');
	product.unit = productCard.find('.unit').text()?.trim();

	return product;
}

function updateProductCard(productId, info) {
	const { name, price, unit } = info;
	const productCard = $(`.product-card[data-id="${productId}"]`);

	productCard.find('.product-name').text(name);
	productCard
		.find('.price')
		.text(formatCurrency(Number(price)))
		.attr('data-price', price);
	productCard.find('.unit').text(unit);
}

function getPhotoSlideSrc(productId, curSrc) {
	photoSlides = [];

	const thumbnail = $(
		`.product-card[data-id="${productId}"] img.card-top`
	).attr('src');
	photoSlides.push(getOriginSrcCloudinary(thumbnail));

	const photos = $(`.product-card[data-id="${productId}"] .photos img`);

	photos.each(function (index) {
		const src = $(this).attr('src');
		photoSlides.push(getOriginSrcCloudinary(src));
		if (src === curSrc) {
			currentSlide = index;
		}
	});
}

function getQuery(page = currentPage, searchBy = search) {
	const sortByPrice = Number($('#sortByPrice').val());
	const sortByName = Number($('#sortByName').val());
	let priceFrom = Number($('#priceFrom').val());
	let priceTo = Number($('#priceTo').val());

	if (priceFrom > priceTo && priceTo !== 0) {
		[priceFrom, priceTo] = [priceTo, priceFrom];
	}

	// currentPage & search get from server
	const searchQuery = searchBy !== '' ? `&search=${searchBy}` : '';
	const pageQuery = page ? `?page=${page}` : '';
	const sortByNameQuery = sortByName !== -1 ? `&sortByName=${sortByName}` : '';
	const sortByPriceQuery =
		sortByPrice !== -1 ? `&sortByPrice=${sortByPrice}` : '';
	const priceFromQuery = priceFrom > 0 ? `&priceFrom=${priceFrom}` : '';
	const priceToQuery = priceTo > 0 ? `&priceTo=${priceTo}` : '';

	return `${ROOT_URL}/list${pageQuery}${searchQuery}${sortByNameQuery}${sortByPriceQuery}${priceFromQuery}${priceToQuery}`;
}

$(document).ready(function () {
	const photoPreviewWrap = $('.photo-preview-wrapper');
	const photoPreview = $('.photo-preview img');
	const toastMsg = $('#toastMsg');
	const editModal = $('#editModal');
	const productNameInput = $('input[name="productName"]');
	const productPriceInput = $('input[name="price"]');
	const productUnitInput = $('input[name="unit"]');

	pagination($('#pagination'), total, pageSize, currentPage, {
		callback: () => {
			$('#pagination li:not(.disabled)').click(async function () {
				const page = $(this).attr('data-num');
				if (page == currentPage) return;
				location.href = getQuery(page, search);
			});
		},
	});

	$('.photos img, img.card-top').click(function () {
		const productId = $(this)
			.parents('.product-card')[0]
			.getAttribute('data-id');

		const imgSrc = $(this).attr('src');
		getPhotoSlideSrc(productId, imgSrc);

		photoPreview.attr('src', photoSlides[currentSlide]);
		photoPreviewWrap.fadeIn(150).css('display', 'flex');
	});

	$('#closePreview').click(() => {
		photoPreviewWrap.fadeOut(150);
	});

	$('.delete-btn').click(async function () {
		const productId = $(this).attr('data-id');
		if (!productId || isNaN(parseInt(productId))) return;

		try {
			const apiRes = await fetch(`${ROOT_URL}/${productId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (apiRes.status === 200) {
				showToastMsg(toastMsg, 'Xoá sản phẩm thành công', 'success', 1000);
				setTimeout(() => {
					location.reload();
				}, 1000);
			}
		} catch (error) {
			showToastMsg(toastMsg, 'Xoá sản phẩm thất bại', 'danger');
		}
	});

	$('.edit-btn').click(function () {
		const productId = $(this).attr('data-id');
		const { name, price, unit } = getProductCardInfo(productId);

		editModal.attr('data-id', productId);

		productNameInput.val(name);
		productPriceInput.val(price);
		productUnitInput.val(unit);
	});

	$('#editProductInfoBtn').click(async function () {
		const productId = editModal.attr('data-id');
		if (!productId) return;
		const { name, price, unit } = getProductCardInfo(productId);

		const newName = productNameInput.val()?.trim();
		const newPrice = productPriceInput.val();
		const newUnit = productUnitInput.val()?.trim();

		if (
			name.toLowerCase() === newName.toLowerCase() &&
			price == newPrice &&
			unit.toLowerCase() === newUnit.toLowerCase()
		) {
			return;
		}

		if (newName.length > 40) {
			return showToastMsg(toastMsg, 'Tên sản phẩm tối đa 40 ký tự', 'warning');
		}
		if (newUnit.length > 10) {
			return showToastMsg(
				toastMsg,
				'Đơn vị sản phẩm tối đa 10 ký tự',
				'warning'
			);
		}
		if (newPrice > 100_000_000) {
			productPriceInput.val(price);
			return showToastMsg(
				toastMsg,
				'Giá sản phẩm tối đa 100.000.000 VNĐ',
				'warning'
			);
		}

		$(this).addClass('disabled');
		const newInfo = { name: newName, price: newPrice, unit: newUnit };

		try {
			const updateResponse = await fetch(`${ROOT_URL}/${productId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newInfo),
			});

			if (updateResponse.status === 200) {
				showToastMsg(toastMsg, 'Cập nhật thành công', 'success');
				editModal.modal('hide');
				updateProductCard(productId, newInfo);
				return;
			}
			showToastMsg(toastMsg, 'Cập nhật thất bại', 'danger');
		} catch (error) {
			showToastMsg(toastMsg, 'Cập nhật thất bại', 'danger');
		} finally {
			$(this).removeClass('disabled');
		}
	});

	$('.arrow.next').click(() => {
		if (currentSlide >= photoSlides.length - 1) {
			currentSlide = 0;
		} else {
			currentSlide++;
		}
		photoPreview.attr('src', photoSlides[currentSlide]);
	});

	$('.arrow.previous').click(() => {
		if (currentSlide <= 0) {
			currentSlide = photoSlides.length - 1;
		} else {
			currentSlide--;
		}
		photoPreview.attr('src', photoSlides[currentSlide]);
	});

	$('#searchBtn').click(function () {
		const searchValue = $('#search').val()?.trim();
		if (searchValue === '') return;
		location.href = getQuery(1, searchValue);
	});

	$('#sortByName').change(function () {
		location.href = getQuery(currentPage, search);
	});

	$('#sortByPrice').change(function () {
		location.href = getQuery(currentPage, search);
	});

	$('#filterBtn').click(function () {
		const priceTo = Number($('#priceTo').val());
		const priceFrom = Number($('#priceFrom').val());
		if (priceTo === 0 && priceFrom === 0) {
			return;
		}

		location.href = getQuery(1, search);
	});

	$('#destroySearch').click(function () {
		location.href = getQuery(1, '');
	});
});

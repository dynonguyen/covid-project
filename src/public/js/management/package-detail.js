let photoSlides = [];
let currentSlide = 0;

function getPhotoSlideSrc(productId, curSrc) {
	photoSlides = [];

	const thumbnail = $(
		`.product-card[data-id="${productId}"] img.card-top`
	).attr('src');
	photoSlides.push(getOriginSrcCloudinary(thumbnail));
	currentSlide = 0;

	const photos = $(`.product-card[data-id="${productId}"] .photos img`);

	photos.each(function (index) {
		const src = $(this).attr('src');
		if (src === curSrc) {
			currentSlide = index + 1;
		}
		photoSlides.push(getOriginSrcCloudinary(src));
	});
}

$(document).ready(function () {
	const photoPreviewWrap = $('.photo-preview-wrapper');
	const photoPreview = $('.photo-preview img');

	loadCart();

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

	// ------------------------------ Show edit package modal ------------------------------
	// $('select').selectize({
	// 	shortField: 'text',
	// });

	$('.edit-btn').click(async function () {
		const modal = $('#editModal');

		modal.removeClass('d-none');
		modal.fadeIn(200).modal('show');

		const productPackageId = $(this).attr('data-productPackageId');
		const productPackageName = $(this).attr('data-productPackageName');
		const limitedProducts = $(this).attr('data-limitedProducts');
		const limitedInDay = $(this).attr('data-limitedInDay');
		const limitedInWeek = $(this).attr('data-limitedInWeek');
		const limitedInMonth = $(this).attr('data-limitedInMonth');

		$('#currentPackageName').text(`( Hiện tại: ${productPackageName} )`);
		$('#currentLP').text(`( Hiện tại: ${limitedProducts} )`);
		$('#currentLID').text(`( Hiện tại: ${limitedInDay} )`);
		$('#currentLIW').text(`( Hiện tại: ${limitedInWeek} )`);
		$('#currentLIM').text(`( Hiện tại: ${limitedInMonth} )`);

		modal.attr('data-productPackageId', productPackageId);
		modal.attr('data-productPackageName', productPackageName);
		modal.attr('data-limitedProducts', limitedProducts);
		modal.attr('data-limitedInDay', limitedInDay);
		modal.attr('data-limitedInWeek', limitedInWeek);
		modal.attr('data-limitedInMonth', limitedInMonth);
	});

	$('#updateBtn').click(async function () {
		const toast = $('#toastMsg');
		const editModal = $('#editModal');

		const productPackageId = Number(editModal.attr('data-productPackageId'));
		console.log('productPackageId', productPackageId);

		let oldPackageName = editModal.attr('data-statusf');
		let newPackageName = $('#newPackageName').val()?.trim() || '';

		let oldLP = editModal.attr('data-limitedProducts');
		let newLP = $('#newLP').val();

		let oldLID = editModal.attr('data-limitedInDay');
		let newLID = $('#newLID').val();

		let oldLIW = editModal.attr('data-limitedInWeek');
		let newLIW = $('#newLIW').val();

		let oldLIM = editModal.attr('data-limitedInMonth');
		let newLIM = $('#newLIM').val();

		// Update mot so thuoc tính
		if (newPackageName === '') {
			newPackageName = oldPackageName;
		}
		if (newLP === '') {
			newLP = oldLP;
		}
		if (newLID === '') {
			newLID = oldLID;
		}
		if (newLIW === '') {
			newLIW = oldLIW;
		}
		if (newLIM === '') {
			newLIM = oldLIM;
		}

		// Update Limit Product
		if (newLP !== '' && Number(newLP) > 1000) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm không được quá 1000',
				'danger',
				4000
			);
			return;
		}

		if (newLID !== '' && Number(newLID) > Number(newLIW)) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm ngày không được nhiều hơn tuần',
				'danger',
				4000
			);
			return;
		}

		if (newLID !== '' && Number(newLID) < 1) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm ngày không được nhỏ hơn 1',
				'danger',
				4000
			);
			return;
		}

		if (newLIW !== '' && Number(newLIW) > Number(newLIM)) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm tuần không được nhiều hơn tháng',
				'danger',
				4000
			);
			return;
		}

		if (newLIW !== '' && Number(newLIW) < 1) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm tuần không được nhỏ hơn 1',
				'danger',
				4000
			);
			return;
		}

		if (newLIM !== '' && Number(newLIM) > Number(newLP)) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm tháng không được nhiều hơn tổng Giới hạn',
				'danger',
				4000
			);
			return;
		}

		if (newLIM !== '' && Number(newLIM) < 1) {
			showToastMsg(
				toast,
				'Giới hạn SL sản phẩm tháng không được nhỏ hơn 1',
				'danger',
				4000
			);
			return;
		}

		$(this).addClass('disabled');

		const resJSON = await fetch('/management/product-packages/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				productPackageId,
				newPackageName,
				newLP,
				newLID,
				newLIW,
				newLIM,
			}),
		});

		if (resJSON.status === 200) {
			showToastMsg(toast, 'Cập nhật thành công', 'success', 1000);
			location.reload();
		} else {
			const { msg } = await resJSON.json();
			$(this).removeClass('disabled');
			showToastMsg(toast, msg || 'Cập nhật thất bại', 'danger', 3000);
		}
	});
});

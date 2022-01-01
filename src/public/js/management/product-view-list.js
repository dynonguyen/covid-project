const ROOT_URL = '/management/products';

$(document).ready(function () {
	const photoPreviewWrap = $('.photo-preview-wrapper');
	const photoPreview = $('.photo-preview img');
	const toastMsg = $('#toastMsg');

	pagination($('#pagination'), total, pageSize, currentPage, {
		callback: () => {
			$('#pagination li:not(.disabled)').click(async function () {
				const page = $(this).attr('data-num');
				if (page == currentPage) return;
				location.href = `${ROOT_URL}/list?page=${page}`;
			});
		},
	});

	$('.photos img').click(function () {
		const imgSrc = $(this).attr('src');
		photoPreview.attr('src', imgSrc);
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
});

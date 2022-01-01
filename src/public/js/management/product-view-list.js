const ROOT_URL = '/management/products/list';

$(document).ready(function () {
	const photoPreviewWrap = $('.photo-preview-wrapper');
	const photoPreview = $('.photo-preview img');

	pagination($('#pagination'), total, pageSize, currentPage, {
		callback: () => {
			$('#pagination li:not(.disabled)').click(async function () {
				const page = $(this).attr('data-num');
				if (page == currentPage) return;
				location.href = `${ROOT_URL}?page=${page}`;
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
});

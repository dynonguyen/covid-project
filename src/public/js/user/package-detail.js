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
});

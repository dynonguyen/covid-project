let isScrollTop = false;

function changeScrollStatus(scrollBtn, isUp = false) {
	isScrollTop = isUp;
	if (isUp) {
		scrollBtn
			.removeClass('bi-arrow-down-circle-fill')
			.addClass('bi-arrow-up-circle-fill');
	} else {
		scrollBtn
			.removeClass('bi-arrow-up-circle-fill')
			.addClass('bi-arrow-down-circle-fill');
	}
}

$(document).ready(function () {
	const scrollBtn = $('#scrollTop');

	// Load init position
	if (window.scrollY > 1000) {
		changeScrollStatus(scrollBtn, true);
		isScrollTop = true;
	}

	$(document).on('scroll', function () {
		const offsetY = window.scrollY;
		if (offsetY > 1000) {
			!isScrollTop && changeScrollStatus(scrollBtn, true);
		} else {
			isScrollTop && changeScrollStatus(scrollBtn, false);
		}
	});

	scrollBtn.click(function () {
		if (scrollBtn.hasClass('bi-arrow-up-circle-fill')) {
			changeScrollStatus(scrollBtn, false);
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		} else {
			changeScrollStatus(scrollBtn, true);
			$('html, body').animate({ scrollTop: $('body').height() }, 'slow');
		}
	});
});

/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />
const DEFAULT = {
	PAGE_SIZE: 8,
};

// show & hide toast message
function showToastMsg(toast, message = 'Message', type = '', timeout = 3000) {
	if (toast) {
		toast
			.html(`${message} <div class="close-icon">x</div>`)
			.addClass(`${type} show`);

		if (timeout !== 0) {
			setTimeout(() => {
				toast.removeClass(`${type} show`);
			}, timeout);
		}
	}
}

// generate pagination
// options - documentation: https://pagination.js.org/index.html
function pagination(
	selector,
	totalItems = 0,
	pageSize = DEFAULT.PAGE_SIZE,
	currentPage = 1,
	options = {}
) {
	if (selector) {
		selector.pagination({
			dataSource: new Array(totalItems).fill(true),
			pageSize,
			currentPage,
			pageRange: 1,
			autoHidePrevious: true,
			autoHideNext: true,
			...options,
		});
	}
}

// auto register when DOM loaded
$(document).ready(function () {
	$('.toast-msg').click(function () {
		$(this).removeClass('show danger warning');
	});

	// show & hide view password input
	$('.view-password-icon').click(function () {
		const that = $(this);
		const field = that.siblings('input.field');

		if (that.hasClass('bi-eye-fill')) {
			that.removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
			field.attr('type', 'password');
		} else {
			that.removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
			field.attr('type', 'text');
		}
	});
});

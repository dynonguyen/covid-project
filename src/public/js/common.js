/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />

// show & hide toast message
function showToastMsg(toast, message = 'Message', type = '', timeout = 3000) {
	if (toast) {
		toast;
		toast
			.html(`${message} <div class="close-icon">x</div>`)
			.addClass(`${type} show`);

		if (timeout !== 0) {
			setTimeout(() => {
				toast.removeClass('show');
			}, timeout);
		}
	}
}

$('.toast-msg').click(function () {
	$(this).removeClass('show');
});

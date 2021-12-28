$(document).ready(function () {
	$('#loginForm').submit(function (e) {
		e.preventDefault();
		const submitBtn = $('#submitBtn');
		const toast = $('#toastMsg');
		const username = $('#username').val()?.trim();
		const password = $('#password').val()?.trim();
		if (!password) {
			$('#password').val('0');
		}

		submitBtn.addClass('disabled');

		if (!username) {
			showToastMsg(toast, 'Vui lòng nhập username', 'warning');
			submitBtn.removeClass('disabled');
			return;
		}

		this.submit();
	});
});

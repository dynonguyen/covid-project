$(document).ready(function () {
	$('#initSystemForm').submit(function (e) {
		e.preventDefault();
		const submitBtn = $('#submitBtn');
		const toastMsg = $('#toastMsg');
		const username = $('#username').val()?.trim();
		const password = $('#password').val();
		const confirmPw = $('#confirmPw').val();

		submitBtn.addClass('disabled');

		// check username
		const usernameRegex = /^([a-zA-Z]|\d|-|_){4,30}$/i;
		if (username === '' || !usernameRegex.test(username)) {
			showToastMsg(
				toastMsg,
				'username bao gồm ký tự số, a-z, -, _ và không chứ khoảng trắng. Độ dài từ 4-30 ký tự',
				'danger'
			);
			return submitBtn.removeClass('disabled');
		}

		// check password
		const strengthPwRegex =
			/^(?=.*[A-Z])(?=.*[!&%\/()=\?\^\*\+\]\[#><;:,\._-|@])(?=.*[0-9])(?=.*[a-z]).{6,40}$/;
		if (!strengthPwRegex.test(password)) {
			showToastMsg(
				toastMsg,
				'Mật khẩu từ 6-40 ký tự, ít nhất 1 ký tự số, 1 ký tự thường, 1 ký tự hoa, 1 ký tự đặc biệt.',
				'danger'
			);
			return submitBtn.removeClass('disabled');
		}

		// confirm password
		if (password !== confirmPw) {
			showToastMsg(toastMsg, 'Mật khẩu không trùng khớp', 'danger');
			return submitBtn.removeClass('disabled');
		}

		// Submit
		this.submit();
	});
});

$(document).ready(function () {
	$('#pwdForm').submit(function (e) {
		e.preventDefault();

		const toastMsg = $('#toastMsg');
		const submitBtn = $('#submitBtn');

		const password = $('#password').val();
		const confirmPw = $('#confirmPw').val();

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

		this.submit();
	});
});

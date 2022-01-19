$(document).ready(function () {
	$('.remind-btn').on('click', async function () {
		const userId = $(this).attr('data-id');
		$(this).addClass('disabled');

		const remindRes = await fetch(
			`/management/payment/remind-pay-debt/${userId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		$(this).removeClass('disabled');

		if (remindRes.status === 200) {
			showToastMsg($('#toastMsg'), 'Nhắc thành công', 'success');
			$(this)
				.removeClass('btn-danger')
				.addClass('btn-success')
				.removeAttr('data-id')
				.text('Đã nhắc');
			return;
		}

		showToastMsg($('#toastMsg'), 'Nhắc thất bại', 'danger');
	});
});

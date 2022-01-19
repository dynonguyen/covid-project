const MAX_MINIUM_LIMIT = 25;

$(document).ready(function () {
	$('#updateBtn').on('click', async function () {
		const newMinimumLimit = Number($('#input').val());

		if (newMinimumLimit < 1 || newMinimumLimit > MAX_MINIUM_LIMIT) {
			return showToastMsg(
				$('#toastMsg'),
				`Hạn mức tối thiểu từ 1-${MAX_MINIUM_LIMIT}%`,
				'warning'
			);
		}

		$(this).addClass('disabled');

		const updateResult = await fetch('/management/payment/minium-limit', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ minimumLimit: newMinimumLimit }),
		});

		$(this).removeClass('disabled');

		if (updateResult.status === 200) {
			showToastMsg($('#toastMsg'), 'Cập nhật thành công', 'success');
			$('#minimumLimit').text(`${newMinimumLimit}%`);
			return $('#input').val('');
		}

		showToastMsg($('#toastMsg'), 'Cập nhật thất bại', 'danger');
	});
});

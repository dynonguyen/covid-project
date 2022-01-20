const config = {
	type: 'bar',
	data: {
		labels: new Array(12).fill(0).map((_, i) => `Tháng ${i + 1}`),
		datasets: [
			{
				label: 'Tổng tiền thanh toán',
				data: payments,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)',
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)',
				],
				borderWidth: 1,
			},

			{
				label: 'Tổng dư nợ',
				data: debts,
				backgroundColor: [
					'rgba(255, 99, 132)',
					'rgba(255, 159, 64)',
					'rgba(255, 205, 86)',
					'rgba(75, 192, 192)',
					'rgba(54, 162, 235)',
					'rgba(153, 102, 255)',
					'rgba(201, 203, 207)',
				],
			},
		],
	},
};

function renderChart() {
	const chartCanvas = document.getElementById('chart');
	const ctx = chartCanvas.getContext('2d');

	if (payments && payments.length > 0) {
		new Chart(chartCanvas, config);
	} else {
		ctx.font = '1.25rem Montserrat';
		ctx.textAlign = 'center';
		ctx.fillText(
			'Không tìm thấy dữ liệu',
			chartCanvas.width / 2,
			chartCanvas.height / 2
		);
	}
}

$(document).ready(function () {
	renderChart();

	$('#yearSelect').change(function () {
		const year = Number($(this).val());
		location.href = `/management/statistic/payment?year=${year}`;
	});
});

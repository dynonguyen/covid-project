console.log(products);
console.log(quantities);

const config = {
	type: 'bar',
	data: {
		labels: products,
		datasets: [
			{
				label: 'Số lượng tiêu thụ',
				data: quantities,
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
	options: {
		indexAxis: 'y',
		maintainAspectRatio: false,
	},
};

function renderChart() {
	const chartCanvas = document.getElementById('chart');
	const ctx = chartCanvas.getContext('2d');

	if (products && products.length > 0) {
		chartCanvas.height = 30 * products.length;
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
});

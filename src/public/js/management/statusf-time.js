/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />

const config = {
	type: 'pie',
	data: {
		labels: ['Khỏi bệnh', 'F0', 'F1', 'F2', 'F3'],
		datasets: [
			{
				data: chartData,
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(54, 162, 235)',
					'rgb(255, 205, 86)',
					'rgb(114, 162, 14)',
					'rgb(247, 92, 30)',
				],
				hoverOffset: 4,
			},
		],
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: 'Toàn quốc',
				font: {
					size: 18,
				},
			},
		},
	},
};

$(document).ready(function () {
	const chartCanvas = document.getElementById('chart');
	const ctx = chartCanvas.getContext('2d');

	if (chartData && chartData.length > 0) {
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

	$('#province').selectize();
});

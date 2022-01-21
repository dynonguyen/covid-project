const config = (chartData, label, color) => ({
	type: 'line',
	data: {
		labels: new Array(12).fill(0).map((_, i) => `Tháng ${i + 1}`),
		datasets: [
			{
				label,
				data: chartData,
				fill: false,
				borderColor: color,
				tension: 0.1,
			},
		],
	},
});

function renderChart(chartId, chartData, label, color) {
	const chartCanvas = document.getElementById(chartId);
	const ctx = chartCanvas.getContext('2d');

	if (chartData && chartData.length > 0) {
		new Chart(chartCanvas, config(chartData, label, color));
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
	renderChart('revenueChart', revenues, 'Doanh thu', 'rgb(75, 192, 192)');

	renderChart(
		'totalPackChart',
		totalPackages,
		'Mức tiêu thụ sản phẩm',
		'rgb(230, 68, 114)'
	);

	$('#totalRevenue').text(
		formatCurrency(revenues?.reduce((sum, r) => sum + r, 0) || 0)
	);
	$('#totalPack').text(
		`${totalPackages?.reduce((sum, p) => sum + p, 0) || 0} Gói`
	);

	$('#yearSelect').change(function () {
		const year = Number($(this).val());
		location.href = `/management/statistic/consumption?year=${year}`;
	});
});

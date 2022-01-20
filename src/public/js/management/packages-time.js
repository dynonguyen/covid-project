function renderChartTitle(start, end) {
	if (!start && !end) {
		return 'Tất cả các giai đoạn';
	}

	let title = '';
	if (start) {
		title += ` Bắt đầu từ ${formatDateToStr(start)} `;
	}
	if (end) {
		title += ` Kết thúc ${formatDateToStr(end)} `;
	}
	return title;
}

function fillChartData(chartData = []) {
	if (chartData.length === 5) return chartData;
	if (chartData.length > 5) return chartData.slice(0, 5);

	const newChartData = new Array(5).fill(0);
	chartData.forEach((item, index) => (newChartData[index] = item));

	return newChartData;
}

function renderChart() {
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
}

const config = {
	type: 'line',
	data: {
		labels: [...chartDataX],
		datasets: [
			{
				data: fillChartData(chartData),
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
				text: renderChartTitle(start, end),
				font: {
					size: 18,
				},
			},
		},
	},
};

$(document).ready(function () {
	renderChart();
	$('#statisticBtn').click(function () {
		let startDate = $('#startDate').val();
		let endDate = $('#endDate').val();
		if (!startDate && !endDate) return;
		if (new Date(endDate) < new Date(startDate)) {
			[startDate, endDate] = [endDate, startDate];
		}

		const { pathname } = window.location;
		location.href = `${pathname}?start=${startDate}&end=${endDate}`;
	});

	$('#resetBtn').click(() => {
		location.href = location.pathname;
	});
});

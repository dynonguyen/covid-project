$(document).ready(function () {
	$('#search').click(function () {
		const keyword = $('#searchInput').val()?.trim();
		if (!keyword) return;
		location.href = `/user?keyword=${keyword}`;
	});
});

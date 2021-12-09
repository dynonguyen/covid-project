/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />

$(document).ready(function () {
	pagination($('#pagination'), total, pageSize, currentPage, {
		showGoInput: true,
		showGoButton: true,
	});

	// When click pagination item
	$('#pagination li:not(.disabled)').click(function () {
		const p = $(this).attr('data-num');
		console.log(p);
	});
});

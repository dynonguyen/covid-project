/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />
const ROOT_URL = '/management/users/list';

$(document).ready(function () {
	// pagination
	pagination($('#pagination'), total, pageSize, currentPage, {
		showGoInput: true,
		showGoButton: true,

		// When click pagination item
		callback: () => {
			$('#pagination li:not(.disabled)').click(async function () {
				const page = $(this).attr('data-num');
				if (page == currentPage) return;
				location.href = ROOT_URL + generateQuery(page, sortList);
			});
		},
	});

	// add sort class
	addSortClass(sortList);

	// sort icon click
	sortIconClick($('.sort-icon'), currentPage, sortList, (query) => {
		location.href = ROOT_URL + query;
	});
});

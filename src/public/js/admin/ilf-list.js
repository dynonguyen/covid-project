const ROOT_URL = '/admin/isolation-facilities/list';

$(document).ready(function () {
	// pagination
	const paginationContainer = $('#pagination');
	if (paginationContainer.length) {
		pagination(paginationContainer, total, pageSize, currentPage, {
			showGoInput: true,
			showGoButton: true,

			// When click pagination item
			callback: () => {
				$('#pagination li:not(.disabled)').click(async function () {
					const page = $(this).attr('data-num');
					if (page == currentPage) return;
					location.href = ROOT_URL + generateQuery(page, sortList, search);
				});

				$('#pagination .paginationjs-go-button').click(function () {
					const input = $('.paginationjs-go-input input');
					const page = parseInt(input.val());
					if (isNaN(page) || page < 1 || page > Math.ceil(total / pageSize)) {
						input.val('');
						return;
					}
					location.href = ROOT_URL + generateQuery(page, sortList, search);
				});
			},
		});
	}

	// add sort class
	addSortClass(sortList);

	// sort icon click
	sortIconClick($('.sort-icon'), currentPage, sortList, search, (query) => {
		location.href = ROOT_URL + query;
	});

	// search button click
	$('#searchBtn:not(.disabled)').click(function () {
		const searchQuery = $('#searchInput').val().trim();
		if (!searchQuery) return;

		$(this).addClass('disabled');

		const href = `${ROOT_URL}${generateQuery(
			1,
			sortList
		)}&search=${searchQuery}`;

		location.href = href;
	});
});

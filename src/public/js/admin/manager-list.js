// const { search } = require('../../../routes/auth.route');

const ROOT_URL = '/admin/managers/list';

$(document).ready(function () {
	console.log('object');
	// pagination
	const paginationContainer = $('#pagination');
	console.log(total, pageSize, currentPage);
	console.log(sortList, search);

	if (paginationContainer.length) {
		pagination(paginationContainer, total, pageSize, currentPage, {
			showGoInput: true,
			showGoButton: true,

			// When click pagination item
			callback: () => {
				$('#pagination li:not(.disabled)').click(async function () {
					const page = $(this).attr('data-num');
					console.log('curent page', page);
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

	// Show package detail (show package modal)
	$('.info-icon').click(async function () {
		const accountId = $(this).attr('data-uuid');
		if (!accountId) return;

		const loading = $('#loading');
		const modalBody = $('#managerModalBody');
		const modal = $('#managerModal');

		// loading
		loading.removeClass('d-none');
		modalBody.empty();
		modal.fadeIn(200).modal('show');

		// fetch this package by packageId
		const managerRes = await fetch(`/admin/managers/${accountId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		loading.addClass('d-none');

		if (managerRes.status === 200) {
			const manager = await managerRes.json();
			modalBody.html(renderPackageDetails(manager));
		} else {
			modalBody.html(
				'<div class="alert alert-danger">Lấy dữ liệu thất bại. Thử lại !</div>'
			);
		}
	});
});

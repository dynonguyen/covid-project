const ROOT_URL = '/admin/isolation-facilities/list';
const MAX_CAPACITY = 5_000_000;

$(document).ready(function () {
	const editModal = $('#editModal');
	const ifNameInput = $('#ifNameInput');
	const ifCapacityInput = $('#ifCapacityInput');
	const toastMsg = $('#toastMsg');

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

	$('.edit-icon').on('click', function () {
		const id = $(this).attr('data-id');
		const ifItem = $(`.if-item[data-id="${id}"]`);
		const currentName = ifItem.find('.name').text();
		const currentCapacity = ifItem.find('.capacity').text();
		ifNameInput.val(currentName);
		ifCapacityInput.val(currentCapacity);
		editModal.modal('show').attr('data-id', id);
	});

	$('#editBtn').on('click', async function () {
		const ifName = ifNameInput.val()?.trim();
		const ifCapacity = Number(ifCapacityInput.val());
		const ifId = editModal.attr('data-id');
		const currentCapacity = Number(
			$(`.if-item[data-id="${ifId}"] .current-quantity`).text()
		);

		if (!ifName) {
			return showToastMsg(
				toastMsg,
				'Vui lòng nhập tên cơ sở điều trị',
				'warning'
			);
		}
		if (ifCapacity > MAX_CAPACITY) {
			return showToastMsg(
				toastMsg,
				'Sức chứa quá lớn, vui lòng kiểm tra lại !',
				'warning'
			);
		}
		if (ifCapacity < currentCapacity) {
			return showToastMsg(
				toastMsg,
				'Sức chứa tối đa phải lớn hơn sức chứa hiện tại !',
				'warning'
			);
		}

		const updateRes = await fetch('/admin/isolation-facilities/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ifName, ifCapacity, ifId }),
		});

		if (updateRes.status === 200) {
			showToastMsg(toastMsg, 'Cập nhật thành công', 'success');
			const ifItem = $(`.if-item[data-id="${ifId}"]`);
			ifItem.find('.name').text(ifName);
			ifItem.find('.capacity').text(ifCapacity);
			return editModal.modal('hide');
		}

		return showToastMsg(toastMsg, 'Cập nhật thất bại, thử lại', 'danger');
	});
});

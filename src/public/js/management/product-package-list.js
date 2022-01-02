const ROOT_URL = '/management/product-packages/list';

const renderPackageDetails = (package) => {
	let tableData = [];
	for (let i = 0; i < package.length; ++i) {
		tableData.push(
			`
      <tr>
				<td>${package[i].productPackageName}</td>
				<td>${package[i].productName}</td>
				<td>${package[i].price}</td>
				<td>${package[i].unit}</td>
				<td>${package[i].maxQuantity}</td>
				<td>${package[i].quantity}</td>
			</tr>
      `
		);
	}

	return (
		`
	  <table class="table table-striped table-light table-bordered w-100">
	    <thead class="thead-dark">
	      <tr>
	        <th scope="col">Tên gói</th>
	        <th scope="col">Tên sản phẩm</th>
	        <th scope="col">Giá</th>
	        <th scope="col">Đơn vị tính</th>
	        <th scope="col">Số lượng tối đa</th>
	        <th scope="col">Số lượng</th>
	      </tr>
	    </thead>
	    <tbody> ` +
		`${tableData}` +
		`</tbody>
	  </table>
	`
	);
};

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

	// Show package detail (show package modal)
	$('.info-icon').click(async function () {
		const packageId = $(this).attr('data-uuid');
		if (!packageId) return;

		const loading = $('#loading');
		const modalBody = $('#packageModalBody');
		const modal = $('#packageModal');

		// loading
		loading.removeClass('d-none');
		modalBody.empty();
		modal.fadeIn(200).modal('show');

		// fetch this package by packageId
		const packageRes = await fetch(
			`/management/product-packages/${packageId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		loading.addClass('d-none');

		if (packageRes.status === 200) {
			const package = await packageRes.json();
			modalBody.html(renderPackageDetails(package));
		} else {
			modalBody.html(
				'<div class="alert alert-danger">Lấy dữ liệu thất bại. Thử lại !</div>'
			);
		}
	});

	// show edit package modal
	$('select').selectize({
		shortField: 'text',
	});

	$('.edit-icon').click(async function () {
		const modal = $('#editModal');

		modal.removeClass('d-none');
		modal.fadeIn(200).modal('show');

		const productPackageId = $(this).attr('data-productPackageId');
		const productPackageName = $(this).attr('data-productPackageName');
		const limitedProducts = $(this).attr('data-limitedProducts');
		const limitedInDay = $(this).attr('data-limitedInDay');
		const limitedInWeek = $(this).attr('data-limitedInWeek');
		const limitedInMonth = $(this).attr('data-limitedInMonth');

		$('#currentPackageName').text(`( Hiện tại: ${productPackageName} )`);
		$('#currentLP').text(`( Hiện tại: ${limitedProducts} )`);
		$('#currentLID').text(`( Hiện tại: ${limitedInDay} )`);
		$('#currentLIW').text(`( Hiện tại: ${limitedInWeek} )`);
		$('#currentLIM').text(`( Hiện tại: ${limitedInMonth} )`);

		modal.attr('data-productPackageId', productPackageId);
		modal.attr('data-productPackageName', productPackageName);
		modal.attr('data-limitedProducts', limitedProducts);
		modal.attr('data-limitedInDay', limitedInDay);
		modal.attr('data-limitedInWeek', limitedInWeek);
		modal.attr('data-limitedInMonth', limitedInMonth);
	});

	$('#updateBtn').click(async function () {
		const toast = $('#toastMsg');
		const editModal = $('#editModal');

		const productPackageId = Number(editModal.attr('data-productPackageId'));
		console.log('productPackageId', productPackageId);

		const oldPackageName = editModal.attr('data-statusf');
		const newPackageName = $('#newPackageName').val();

		const oldLP = editModal.attr('data-limitedProducts');
		const newLP = $('#newLP').val();

		const oldLID = editModal.attr('data-limitedInDay');
		const newLID = $('#newLID').val();

		const oldLIW = editModal.attr('data-limitedInWeek');
		const newLIW = $('#newLIW').val();

		const oldLIM = editModal.attr('data-limitedInMonth');
		const newLIM = $('#newLIM').val();

		if (
			newPackageName === '' ||
			newLP === '' ||
			newLID === '' ||
			newLIW === '' ||
			newLIM === ''
		) {
			showToastMsg(
				toast,
				'Cần nhập đầy đủ thông tin để cập nhật',
				'danger',
				4000
			);
			return;
		}
		// if (
		// 	(oldStatusF == newStatusF || newStatusF == '') &&
		// 	(oldIF == newIF || newIF == '') &&
		// 	oldIsLocked == newIsLocked
		// ) {
		// 	return;
		// }

		// if (newStatusF > oldStatusF) {
		// 	showToastMsg(
		// 		toast,
		// 		'Không thể chuyển trạng thái từ cấp cao về cấp thấp hơn',
		// 		'danger',
		// 		4000
		// 	);
		// 	return;
		// }

		// if (newStatusF == -1 && oldStatusF != 0) {
		// 	showToastMsg(
		// 		toast,
		// 		'Chỉ cập nhật trạng thái "Khỏi bệnh" cho bệnh nhân F0',
		// 		'danger',
		// 		4000
		// 	);
		// 	return;
		// }

		$(this).addClass('disabled');

		const resJSON = await fetch('/management/product-packages/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				productPackageId,
				newPackageName,
				newLP,
				newLID,
				newLIW,
				newLIM,
			}),
		});

		if (resJSON.status === 200) {
			showToastMsg(toast, 'Cập nhật thành công', 'success', 1000);
			location.reload();
		} else {
			const { msg } = await resJSON.json();
			$(this).removeClass('disabled');
			showToastMsg(toast, msg || 'Cập nhật thất bại', 'danger', 3000);
		}
	});
});

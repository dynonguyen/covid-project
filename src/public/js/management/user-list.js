/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />

const ROOT_URL = '/management/users/list';

const renderUserTreatmentHistories = (treatmentHistories = []) => {
	if (treatmentHistories.length === 0) {
		return '<p class="text-center">Không có ghi nhận nào</p>';
	}

	let tableHtml = '';
	treatmentHistories.forEach(
		(th, index) =>
			(tableHtml += `<tr>
    <th scope="row">${index + 1}</th>
    <td>${th.isolationFacilityName}</td>
    <td>${formatDateToStr(th.startDate)}</td>
    <td>${th.endDate ? formatDateToStr(th.endDate) : '_'}</td>
    <td>${convertStatusFToStr(th.statusF)}</td>
  </tr>`)
	);

	return `
<table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Nơi điều trị</th>
      <th scope="col">Ngày bắt đầu</th>
      <th scope="col">Ngày kết thúc</th>
      <th scope="col">Tình trạng</th>
    </tr>
  </thead>
  <tbody>
    ${tableHtml}
  </tbody>
</table>
  `;
};

const renderRelatedList = (relatedList = []) => {
	if (relatedList.length === 0) {
		return '<p class="text-center">Không có ghi nhận nào</p>';
	}

	let tableHtml = '';
	relatedList.forEach(
		(user) =>
			(tableHtml += `<tr>
    <td>${user.fullname}</td>
    <td>${user.address}</td>
    <td>${user.peopleId}</td>
    <td>${new Date(user.DOB).getFullYear()}</td>
    <td>${convertStatusFToStr(user.statusF)}</td>
  </tr>`)
	);

	return `
<table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">Họ tên</th>
      <th scope="col">Địa chỉ</th>
      <th scope="col">CMND/CCCD</th>
      <th scope="col">Năm sinh</th>
      <th scope="col">Trạng thái</th>
    </tr>
  </thead>
  <tbody>
    ${tableHtml}
  </tbody>
</table>`;
};

const renderUserDetails = (user) => {
	console.log(user);
	const {
		fullname,
		address,
		DOB,
		createdAt,
		updatedAt,
		isLocked,
		peopleId,
		manager,
		statusF,
		relatedList,
		treatmentHistories,
	} = user;

	return `
<h3 class="mb-4 text-center text-uppercase">${fullname}</h3>

<h4 class="label">Thông tin cá nhân</h4>
<ul class="info">
  <li><span>CMND/CCCD: </span>${peopleId}</li>
  <li><span>Ngày sinh: </span>${formatDateToStr(DOB)}</li>
  <li><span>Địa chỉ: </span>${address}</li>
  <li><span>Tình trạng bệnh: </span>${convertStatusFToStr(statusF)}</li>
  <li><span>Người quản lý: </span>${manager}</li>
  <li><span>Trạng thái tài khoản: </span>${
		isLocked ? 'Đã khoá' : 'Đang hoạt động'
	}</li>
  <li><span>Ngày ghi nhận: </span>${formatDateToStr(createdAt)}</li>
  <li><span>Ngày cập nhật gần nhất: </span>${formatDateToStr(updatedAt)}</li>
  <li><span>Tổng số ca liên quan: </span>${relatedList.length}</li>
</ul>

<div class="py-1 my-3 bg-info"></div>

<h4 class="label">Lịch sử điều trị</h4>
${renderUserTreatmentHistories(treatmentHistories)}

<div class="py-1 my-3 bg-info"></div>

<h4 class="label">Trường hợp liên quan</h4>
${renderRelatedList(relatedList)}
`;
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

	// show user modal
	$('.info-icon').click(async function () {
		const uuid = $(this).attr('data-uuid');
		if (!uuid) return;

		const loading = $('#loading');
		const modalBody = $('#userModalBody');
		const modal = $('#userModal');

		// loading
		loading.removeClass('d-none');
		modalBody.empty();
		modal.fadeIn(200).modal('show');

		// fetch this user by user's uuid
		const userRes = await fetch(`/management/users/${uuid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		loading.addClass('d-none');

		if (userRes.status === 200) {
			const user = await userRes.json();
			modalBody.html(renderUserDetails(user));
		} else {
			modalBody.html(
				'<div class="alert alert-danger">Lấy dữ liệu thất bại. Thử lại !</div>'
			);
		}
	});

	// show edit user modal
	$('select').selectize({
		shortField: 'text',
	});

	$('.edit-icon').click(async function () {
		const modal = $('#editModal');

		modal.removeClass('d-none');
		modal.fadeIn(200).modal('show');

		const statusF = $(this).attr('data-statusf');
		const IFacility = $(this).attr('data-if');
		const uuid = $(this).attr('data-uuid');

		$('#currentStatusF').text(`( Hiện tại: ${convertStatusFToStr(statusF)} )`);
		$('#currentIF').text(`( Hiện tại: ${IFacility} )`);

		modal.attr('data-uuid', uuid);
		modal.attr('data-statusf', statusF);
	});

	$('#updateBtn').click(function () {
		const newStatusF = Number($('#statusFSelect').val());
		const oldStatusF = Number($('#editModal').attr('data-statusf'));
		const newIF = $('#IFSelect').val();
		const uuid = $('#editModal').attr('data-uuid');
		const toast = $('#toastMsg');

		if (newStatusF >= oldStatusF) {
			showToastMsg(
				toast,
				'Không thể chuyển trạng thái từ cấp cao về cấp thấp hơn',
				'danger',
				4000
			);
			return;
		}
	});
});

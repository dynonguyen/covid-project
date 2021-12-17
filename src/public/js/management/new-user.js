let toastMsg = null;
let provinces = [];
let isolationFacilities = [];
let originStatusF = STATUS_F.F0;
let originUser = {};
let relatedUsers = {
	f1: [],
	f2: [],
	f3: [],
};

/* ============== UTILS FUNCTION =============== */
async function getProvincesAjax() {
	const pRes = await fetch('/api/provinces', {
		method: 'GET',
	});
	provinces = (await pRes.json()) || [];
}

async function getDistrictAjax(provinceId) {
	const dRes = await fetch(`/api/district/${provinceId}`, { method: 'GET' });
	return await dRes.json();
}

async function getWardAjax(districtId) {
	const wRes = await fetch(`/api/ward/${districtId}`, { method: 'GET' });
	return await wRes.json();
}

async function getIsolationFacilities() {
	const isoFac = await fetch('/api/iso-facilities', { method: 'GET' });
	isolationFacilities = (await isoFac.json()) || [];
}

async function getUserListWithStatusF(statusF) {
	const users = await fetch(`/api/users/statusF/${statusF}`, { method: 'GET' });
	return users || [];
}

/* ============== RENDER HTML =============== */
function renderProvinceToSelect(seletor) {
	const provinceOptions = provinces
		.map((p) => `<option value="${p.id}">${p.name}</option>`)
		?.join();
	const html = `
  <option selected, disabled, hidden, value="">Chọn tỉnh / thành</option>
  ${provinceOptions}
`;

	$(seletor).html(html);
}

function renderIsolationFacilitySelect(seletor) {
	const isolationFacOptions = isolationFacilities
		.map(
			(i) =>
				`<option value="${i.isolationFacilityId}">${i.isolationFacilityName}</option>`
		)
		?.join();
	const html = `
  <option selected, disabled, hidden, value="">Chọn cơ sở điều trị</option>
  ${isolationFacOptions}
`;

	$(seletor).html(html);
}

function renderAddUserForm(selector, f = STATUS_F.F1) {
	let relatedSearch = '';

	if (originStatusF + 1 !== f) {
		const relatedList = relatedUsers[`f${f - 1}`];
		const realtedOptions = relatedList
			.map(
				(u) =>
					`<option value="${u.peopleId}">${u.fullname} - ${u.peopleId}</option>`
			)
			?.join(' ');

		relatedSearch = `
    <div class="center-vertical mb-3">
      <label class="field-inline-label" for="related${f}">
        Nguồn F${f - 1}
      </label>
      <select class="related flex-grow-1" id="related${f}" name="related">
        <option selected="selected" disabled="disabled" hidden="hidden" value="">Chọn nguồn gốc lây nhiễm</option>
        ${realtedOptions}
      </select>
    </div>
    `;
	}

	const isoFacSelect = `<div class="center-vertical mb-3">
  <label class="field-inline-label" for="isoFacility${f}">Cơ sở điều trị</label>
  <select class="isoFacility flex-grow-1" id="isoFacility${f}" name="isoFacility">
    <option selected="selected" disabled="disabled" hidden="hidden" value="">Chọn cơ sở điều trị</option>
    ${isolationFacilities
			.map(
				(i) =>
					`<option value="${i.isolationFacilityId}">${i.isolationFacilityName}</option>`
			)
			?.join(' ')}
  </select>
</div>`;

	const html = `
  <div class="toggle-form p-3" data-form="${f}">
    <div class="center-vertical mb-3">
    <label class="field-inline-label" for="fullname">Họ tên:</label>
    <input
      class="field"
      id="fullname"
      type="text"
      name="fullname"
      autofocus="autofocus"
    />
    </div>

    <div class="center-vertical mb-3">
    <label class="field-inline-label" for="peopleId">CMND/CCCD:</label>
    <input class="field" id="peopleId" type="text" name="peopleId" />
    </div>

    <div class="center-vertical mb-3">
    <label class="field-inline-label" for="DOB">Ngày sinh:</label>
    <input class="field" id="DOB" type="date" name="DOB" />
    </div>

    <div class="address mb-3">
      <label class="mb-3 field-inline-label" for="addrDetails">Địa chỉ:</label>
      <input
        class="mb-3 field w-100"
        id="addrDetails"
        type="text"
        name="addrDetails"
        placeholder="Số nhà, đường, tổ / thôn"
      />

      <select class="mb-2 province" name="province">
        <option selected hidden disabled value="">Chọn tỉnh / thành</option>
      </select>
      <select class="mb-2 district" name="district">
        <option selected hidden disabled value="">Chọn quận / huyện</option>
      </select>
      <select class="ward" name="ward">
        <option selected hidden disabled value="">Chọn xã / phường</option>
      </select>
    </div>

    ${isoFacSelect}
    ${relatedSearch}

    <div class="text-right mt-4">
      <div class="btn btn-danger reset-btn mr-2">Điền lại</div>
      <div class="btn btn-primary related-add-btn" data-f=${f}>Thêm</div>
    </div>
  </div>
  `;

	$(selector).html(html);

	renderProvinceToSelect(`${selector} .province`);
	$(`${selector} select`).selectize();

	onProvinceChange(`${selector} .province`);
	onRelatedUserBtnClick();
	onResetBtnClick();
}

/* ============== EVENT HANDLER =============== */
function onProvinceChange(selector) {
	$(selector).change(async function () {
		const id = Number($(this).val());
		if (!id || isNaN(id)) return;
		const districts = (await getDistrictAjax(id)) || [];

		const select = $(selector).siblings('.district');
		const selectize = select[0].selectize;
		selectize.clearOptions();

		// reset ward select
		const wardSelect = $(selector).siblings('.ward')[0]?.selectize;
		wardSelect?.clear();
		wardSelect?.clearOptions();

		districts.forEach((d) =>
			selectize.addOption({
				text: `${d.prefix} ${d.name}`,
				value: d.id,
			})
		);

		onDistrictChange(select);
	});
}

function onDistrictChange(jqSelector) {
	// get and render ward select when district change
	jqSelector.change(async function () {
		const id = Number($(this).val());
		if (!id || isNaN(id)) return;

		const wards = (await getWardAjax(id)) || [];

		const select = jqSelector.siblings('.ward');
		const selectize = select[0].selectize;
		selectize.clearOptions();

		wards.forEach((w) =>
			selectize.addOption({
				text: `${w.prefix} ${w.name}`,
				value: w.id,
			})
		);
	});
}

function onRootStatusFChange() {
	$('.statusf').change(async function () {
		const f = Number($(this).val());
		if (isNaN(f)) return;

		originStatusF = f;
		showHideRelatedBox(f);

		// reset all
		$('.related-list').html('');
		relatedUsers = { f1: [], f2: [], f3: [] };

		const relatedSearch = $('#relatedSearch');
		if (f !== STATUS_F.F0) {
			const relatedUsers =
				(await (await getUserListWithStatusF(f - 1))?.json()) || [];

			const select = $('#related');
			const selectize = select[0].selectize;
			selectize.clearOptions();
			relatedUsers.forEach((u) =>
				selectize.addOption({
					text: `${u.fullname} - ${u.peopleId}`,
					value: u.uuid,
				})
			);

			relatedSearch.find('label').text(`Nguồn ${convertStatusFToStr(f - 1)}`);
			relatedSearch.removeClass('d-none');
		} else {
			relatedSearch.addClass('d-none');
		}
	});
}

function onRelatedUserBtnClick() {
	$('.related-add-btn').click(function () {
		const statusF = $(this).attr('data-f');
		const user = getUserFormValue(Number(statusF));

		const validation = userInfoValidate(user, statusF);
		if (validation.error) {
			return showToastMsg(toastMsg, validation.msg, 'danger');
		}

		relatedUsers[`f${statusF}`].push(user);
		addRelateUserToListBox(statusF, user.fullname, user.peopleId);
		clearForm(`#f${statusF}AddForm`);
	});
}

function onResetBtnClick() {
	$('.reset-btn').click(function () {
		const boxId = $(this).parents('.box')[0].id;
		clearForm(`#${boxId}`);
	});
}

function onDeleteRelatedUser() {
	$('.delete-user-icon').click(function () {
		const id = $(this).attr('data-id');

		$(this).parents('.related-user').remove();

		relatedUsers.f1 = relatedUsers.f1.filter((u) => u.peopleId !== id);
		relatedUsers.f2 = relatedUsers.f2.filter(
			(u) => u.peopleId !== id && u.related !== id
		);
		relatedUsers.f3 = relatedUsers.f3.filter(
			(u) => u.peopleId !== id && u.related !== id
		);

		$('.related-list').html('');
		for (let f in relatedUsers) {
			relatedUsers[f].forEach((u) =>
				addRelateUserToListBox(Number(f[1]), u.fullname, u.peopleId)
			);
		}
	});
}

function onAddUserClick() {
	$('#addUser').click(async function () {
		$(this).addClass('disabled');

		const user = getUserFormValue(originStatusF);
		const { error, msg } = userInfoValidate(user, originStatusF);
		if (error) {
			$(this).removeClass('disabled');
			return showToastMsg($('#toastMsg'), msg, 'danger', 4000);
		}

		user.relatedList = [];
		if (originStatusF !== STATUS_F.F3) {
			const firstRelatedF = originStatusF + 1;
			const list1 = relatedUsers[`f${firstRelatedF}`];

			list1.forEach((item1) => {
				const relatedUser = { ...item1 };
				const relatedList1 = [];

				const secondRelatedF = originStatusF + 2;
				const list2 = relatedUsers[`f${secondRelatedF}`];

				if (list2) {
					list2.forEach((item2) => {
						if (item2.related === item1.peopleId) {
							const thirdRelatedF = originStatusF + 3;
							const list3 = relatedUsers[`f${thirdRelatedF}`];

							if (list3) {
								const rl = list3.filter(
									(item3) => item3.related === item2.peopleId
								);
								relatedList1.push({ ...item2, relatedList: [...rl] });
							} else {
								relatedList1.push({ ...item2, relatedList: [] });
							}
						}
					});
				}

				user.relatedList.push({
					...relatedUser,
					relatedList: [...relatedList1],
				});
			});
		}

		// POST add user
		const resJSON = await fetch('/management/users/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});

		if (resJSON.status === 200) {
			showToastMsg($('#toastMsg'), 'Thêm thành công.', 'success', 3000);
			$(this).removeClass('disabled');
			clearForm('#originUserBox');
			clearForm('#f1AddForm');
			clearForm('#f2AddForm');
			clearForm('#f3AddForm');
			$('.related-list').html('');
			originUser = {};
			relatedUsers = { f1: [], f2: [], f3: [] };

			return;
		}

		// failed
		const responseApi = await resJSON.json();
		showToastMsg(
			$('#toastMsg'),
			responseApi.msg || 'Thêm thất bại',
			'danger',
			5000
		);
		$(this).removeClass('disabled');
	});
}

/* ============== INIT =============== */
async function initLoad() {
	// auto get province
	await getProvincesAjax();
	renderProvinceToSelect('#province');

	await getIsolationFacilities();
	renderIsolationFacilitySelect('#isoFacility');

	// setting selectize
	$('select').selectize();
}

/* ============== ACTIONS =============== */
function showHideRelatedBox(statusF = 0) {
	for (let i = 1; i <= 3; ++i) {
		if (i <= statusF) {
			$(`#relatedBox${i}`).addClass('d-none');
		} else {
			$(`#relatedBox${i}`).removeClass('d-none');
		}
	}
}

function getUserFormValue(statusF) {
	let boxId = '';
	let user = {};

	switch (statusF) {
		case originStatusF:
			boxId = '#originUserBox';
			break;
		case STATUS_F.F1:
			boxId = '#f1Box';
			break;
		case STATUS_F.F2:
			boxId = '#f2Box';
			break;
		case STATUS_F.F3:
			boxId = '#f3Box';
			break;
		default:
			return user;
	}

	user.fullname = $(`${boxId} input[name="fullname"]`).val();
	user.peopleId = $(`${boxId} input[name="peopleId"]`).val();
	user.DOB = $(`${boxId} input[name="DOB"]`).val();
	user.details = $(`${boxId} input[name="addrDetails"]`).val();
	user.provinceId = $(`${boxId} select[name="province"]`).val();
	user.districtId = $(`${boxId} select[name="district"]`).val();
	user.wardId = $(`${boxId} select[name="ward"]`).val();
	user.isolationFacility = $(`${boxId} select[name="isoFacility"]`).val();

	if (boxId === '#originUserBox') {
		user.statusF = $(`${boxId} select[name="statusF"]`).val();
	}

	if (
		(boxId === '#originUserBox' && statusF !== STATUS_F.F0) ||
		statusF > originStatusF + 1
	) {
		user.related = $(`${boxId} select[name="related"]`).val();
	}

	return user;
}

function isExistUser(peopleId) {
	if (peopleId === originUser.peopleId) return true;
	for (let u of relatedUsers.f1) {
		if (u.peopleId === peopleId) return true;
	}
	for (let u of relatedUsers.f2) {
		if (u.peopleId === peopleId) return true;
	}
	for (let u of relatedUsers.f3) {
		if (u.peopleId === peopleId) return true;
	}

	return false;
}

function userInfoValidate(user, f) {
	const {
		fullname,
		peopleId,
		DOB,
		details,
		provinceId,
		districtId,
		wardId,
		isolationFacility,
		related,
	} = user;

	const fullnameRegex = /^[^`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]{1,50}$/i;
	if (!fullname || !fullnameRegex.test(fullname)) {
		return { error: true, msg: 'Họ tên không hợp lệ' };
	}

	const pRegex = /^\d{9,12}$/;
	if (!peopleId || !pRegex.test(peopleId)) {
		return {
			error: true,
			msg: 'CMND/CCCD có 9-12 chữ số (Trường hợp trẻ dưới 14 tuổi có thể dùng CMND của người bảo hộ) !',
		};
	}

	if (isExistUser(peopleId)) {
		return {
			error: true,
			msg: 'Bệnh nhân đã tồn tại (kiểm tra lại CMND/CCCD)',
		};
	}

	if (!DOB || new Date(DOB).getTime() >= Date.now()) {
		return { error: true, msg: 'Ngày sinh không hợp lệ' };
	}

	if (!details) {
		return { error: true, msg: 'Vui lòng điền địa chỉ cụ thể' };
	}

	if (!provinceId || isNaN(Number(provinceId))) {
		return { error: true, msg: 'Vui lòng chọn tỉnh/thành phố' };
	}

	if (!districtId || isNaN(Number(districtId))) {
		return { error: true, msg: 'Vui lòng chọn quận/huyện' };
	}

	if (!wardId || isNaN(Number(wardId))) {
		return { error: true, msg: 'Vui lòng chọn xã/phường' };
	}

	if (!isolationFacility || isNaN(Number(isolationFacility))) {
		return { error: true, msg: 'Vui lòng chọn cơ sở điều trị' };
	}

	if ((f === originStatusF && f !== STATUS_F.F0) || f > originStatusF + 1) {
		if (!related) {
			return { error: true, msg: 'Vui lòng chọn nguồn gốc lây bệnh' };
		}
	}

	return { error: false };
}

function addRelateUserToListBox(statusF, fullname, peopleId) {
	$(`.related-list[data-f="${statusF}"]`).append(
		`<div class="related-user flex-center-between">
      <span>${fullname} - ${peopleId}</span>
      <i class="bi bi-trash cur-pointer text-danger delete-user-icon" data-id="${peopleId}" data-f="${statusF}"></i>
    </div>`
	);

	onDeleteRelatedUser();
}

function clearForm(formId) {
	$(`${formId} input`).val('');
	const province = $(`${formId} .province`)[0]?.selectize;
	const district = $(`${formId} .district`)[0]?.selectize;
	const ward = $(`${formId} .ward`)[0]?.selectize;

	province?.clear();

	district?.clear();
	district?.clearOptions();

	ward?.clear();
	ward?.clearOptions();
}

$(document).ready(async function () {
	toastMsg = $('#toastMsg');

	initLoad();

	onRootStatusFChange();

	onAddUserClick();

	$('.toggle-action').click(function () {
		const that = $(this);
		const target = that.attr('data-toggle-target');
		$(`#${target}`).slideToggle(250);

		// toogle arrow
		const arrowIcon = $(this).find('i.bi');
		if (arrowIcon.hasClass('bi-chevron-down')) {
			arrowIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
		} else if (arrowIcon.hasClass('bi-chevron-up')) {
			arrowIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
		}
	});

	onProvinceChange('#province');

	onResetBtnClick();

	$('.add-form-btn').click(function () {
		const target = `#${$(this).attr('data-toggle-target')}`;
		const statusF = $(this).attr('data-f');

		const addForm = $(target);
		renderAddUserForm(target, Number(statusF));
		addForm.slideToggle(250);
	});
});

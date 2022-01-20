const MAX_NAME_LEN = 100,
	MAX_CAPACITY = 50_000_000;

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

async function initLoad() {
	// auto get province
	await getProvincesAjax();
	renderProvinceToSelect('#province');

	// setting selectize
	$('select').selectize();
}

$(document).ready(async function () {
	toastMsg = $('#toastMsg');
	initLoad();
	onProvinceChange('#province');

	$('#form').on('submit', function (e) {
		e.preventDefault();
		const ifName = $('#ifName').val()?.trim();
		const capacity = Number($('#ifCapacity').val());
		const addressDetail = $('#addressDetail').val()?.trim();
		if (!ifName) {
			return showToastMsg(
				toastMsg,
				'Vui lòng nhập tên cơ sở điều trị',
				'danger'
			);
		}
		if (ifName.length > MAX_NAME_LEN) {
			return showToastMsg(
				toastMsg,
				`Tên dài tối đa ${MAX_NAME_LEN} ký tự`,
				'danger'
			);
		}

		if (capacity > MAX_CAPACITY) {
			return showToastMsg(
				toastMsg,
				'Sức chứa quá lớn, vui lòng kiềm tra lại',
				'danger'
			);
		}
		if (!addressDetail) {
			return showToastMsg(toastMsg, 'Vui lòng nhập địa chỉ chi tiết', 'danger');
		}

		$('#submitBt').addClass('disabled');
		this.submit();
	});
});

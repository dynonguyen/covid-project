let toastMsg = null;
let products = [];
let addedProducts = [];

/* ============== UTILS FUNCTION =============== */
async function getProductsAjax() {
	const pRes = await fetch('/api/products', {
		method: 'GET',
	});
	products = (await pRes.json()) || [];
}

/* ============== RENDER HTML =============== */
function renderProductToSelect(selector) {
	const productOptions = products
		.map(
			(p) =>
				`<option value="${p.productId}">${p.productId} - ${p.productName} - ${p.price} - ${p.unit}</option>`
		)
		?.join();
	const html = `
  <option selected, disabled, hidden, value="">Chọn sản phẩm</option>
  ${productOptions}`;

	$(selector).html(html);

	// setting selectize
	$('#product').selectize();
}

/* ============== EVENT HANDLER =============== */

function onAddProductBtnClick() {
	$('.product-add-btn').click(function () {
		const productId = $('.item').attr('data-value');
		const maxQuantity = $('#maxQuantity').val();

		if (isExistProduct(productId) === true) {
			return showToastMsg(toastMsg, 'Sản phẩm đã tồn tại trong gói', 'danger');
		}

		addProductToListBox(productId, maxQuantity);

		$('#product, #maxQuantity').val('');

		// them vao mang addedProducts
		let productInPackage = {};
		productInPackage.productId = productId;
		productInPackage.maxQuantity = maxQuantity;

		addedProducts.push(productInPackage);
	});
}

function onDeleteAddedProduct() {
	$('.delete-user-icon').click(function () {
		const id = $(this).attr('data-id');

		$(this).parents('.added-product').remove();

		addedProducts = addedProducts.filter((u) => u.productId !== id);
	});
}

/* ============== INIT =============== */
async function initLoad() {
	// auto get product
	await getProductsAjax();
	renderProductToSelect('#product');
}

/* ============== ACTIONS =============== */
function addProductToListBox(productId, maxQuantity) {
	$(`.product-list`).append(
		`<div class="added-product flex-center-between mt-3">
      <span>Mã SP: ${productId} - SL tối đa: ${maxQuantity}</span>
      <i class="bi bi-trash cur-pointer text-danger delete-user-icon" data-id="${productId}"></i>
    </div>`
	);

	onDeleteAddedProduct();
}

function isExistProduct(productId) {
	for (let p of addedProducts) {
		if (p.productId === productId) return true;
	}

	return false;
}

$(document).ready(async function () {
	toastMsg = $('#toastMsg');

	initLoad();

	$('.toggle-action').click(function () {
		const that = $(this);
		const target = that.attr('data-toggle-target');
		$(`#${target}`).slideToggle(250);

		// toggle arrow
		const arrowIcon = $(this).find('i.bi');
		if (arrowIcon.hasClass('bi-chevron-down')) {
			arrowIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
		} else if (arrowIcon.hasClass('bi-chevron-up')) {
			arrowIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
		}
	});

	onAddProductBtnClick();

	$('.add-form-btn').click(function () {
		const target = `#${$(this).attr('data-toggle-target')}`;

		const addForm = $(target);
		renderAddProductForm(target);
		addForm.slideToggle(250);
	});

	$('#form').on('submit', async function (e) {
		e.preventDefault();

		const productPackageName = $('#productPackageName').val()?.trim();
		const limitedProducts = parseInt($('#limitedProducts').val());
		const limitedInDay = parseInt($('#limitedInDay').val());
		const limitedInWeek = parseInt($('#limitedInWeek').val());
		const limitedInMonth = parseInt($('#limitedInMonth').val());

		if (limitedInDay === 0 || limitedInDay > limitedInWeek)
			return showToastMsg(
				toastMsg,
				'Giới hạn SL sản phẩm ngày không được nhiều hơn tuần',
				'danger'
			);

		if (limitedInWeek === 0 || limitedInWeek > limitedInMonth)
			return showToastMsg(
				toastMsg,
				'Giới hạn SL sản phẩm tuần không được nhiều hơn tháng',
				'danger'
			);

		if (productPackageName === '')
			return showToastMsg(toastMsg, 'Vui lòng nhập tên gói', 'danger');

		$('#submitBtn').addClass('disabled');

		const newPackageRes = await fetch('/management/product-packages/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				productPackageName,
				limitedProducts,
				limitedInWeek,
				limitedInDay,
				limitedInMonth,
				products: addedProducts,
			}),
		});

		if (newPackageRes.status === 200) {
			showToastMsg(toastMsg, 'Thêm gói Nhu yếu phẩm thành công', 'success');

			$(this).find('input, select').val('');
			$('.added-product').remove();
			addedProducts.length = 0;
		} else {
			const { productPackageName, msg } = await newPackageRes.json();
			showToastMsg(toastMsg, msg, 'danger');
		}

		$('#submitBtn').removeClass('disabled');
	});
});

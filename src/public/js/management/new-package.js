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
				`<option value="${p.productId}">${p.productName} - ${p.price} - ${p.unit}</option>`
		)
		?.join();
	const html = `
  <option selected, disabled, hidden, value="">Chọn sản phẩm</option>
  ${productOptions}`;

	$(selector).html(html);
}

/* ============== EVENT HANDLER =============== */

function onAddProductBtnClick() {
	$('.product-add-btn').click(function () {
		const productId = $('.item').attr('data-value');
		const maxQuantity = $('#maxQuantity').val();

		addProductToListBox(productId, maxQuantity);
		// clearForm(`#f${statusF}AddForm`);

		console.log('addedProducts: ', productId + ' ' + maxQuantity);
		console.log('addedProducts: ', addedProducts);
	});
}

/* ============== INIT =============== */
async function initLoad() {
	// auto get product
	await getProductsAjax();
	renderProductToSelect('#product');

	// setting selectize
	$('select').selectize();
}

/* ============== ACTIONS =============== */
function addProductToListBox(productId, maxQuantity) {
	$(`.product-list`).append(
		`<div class="added-product flex-center-between">
      <span>${productId} - ${maxQuantity}</span>
      <i class="bi bi-trash cur-pointer text-danger delete-user-icon" data-id="${productId}"></i>
    </div>`
	);
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

	// test nut them san pham
	$('#productAddForm').click(function () {
		console.log('object', $(this).attr);
	});

	$('.add-form-btn').click(function (e) {
		e.preventDefault();
		const target = `#${$(this).attr('data-toggle-target')}`;

		const addForm = $(target);
		renderAddProductForm(target);
		addForm.slideToggle(250);

		console.log('target', target);
	});
});

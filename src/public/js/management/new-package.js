let toastMsg = null;
let products = [];
let addedProducts = {
	product: [],
};

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

function renderAddProductForm(selector) {
	const html = `
  <div class="toggle-form p-3">
    <div class="addProduct mb-3">
      <select class="mb-2 product" name="productId">
        <option selected hidden disabled value="">Chọn sản phẩm</option>
      </select>
    </div>
    <input class="price.field.mb-3", type="number", name="maxQuantity", placeholder="Nhập giới hạn gói", min="0", max="1000">

    <div class="text-right mt-4">
      <div class="btn btn-danger reset-btn mr-2">Điền lại</div>
      <div class="btn btn-primary related-add-btn">Thêm</div>
    </div>
  </div>
  `;

	$(selector).html(html);

	renderProductToSelect(`${selector} .product`);
	$(`${selector} select`).selectize();

	onProductChange(`${selector} .product`);
}

/* ============== EVENT HANDLER =============== */
function onProductChange(selector) {
	$(selector).change(async function () {
		const id = Number($(this).val());
		if (!id || isNaN(id)) return;
	});
}

function onResetBtnClick() {
	$('.reset-btn').click(function () {
		const boxId = $(this).parents('.box')[0].id;
		clearForm(`#${boxId}`);
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

	onProductChange('#product');

	onResetBtnClick();

	$('.add-form-btn').click(function (e) {
		e.preventDefault();
		const target = `#${$(this).attr('data-toggle-target')}`;

		const addForm = $(target);
		renderAddProductForm(target);
		addForm.slideToggle(250);
	});
});

// const ROOT_URL = '/management/product-packages/list';

// const renderPackageDetails = (package) => {
// 	let tableData = [];
// 	for (let i = 0; i < package.length; ++i) {
// 		tableData.push(
// 			`
//       <tr>
// 				<td>${package[i].productPackageName}</td>
// 				<td>${package[i].productName}</td>
// 				<td>${package[i].price}</td>
// 				<td>${package[i].unit}</td>
// 				<td>${package[i].maxQuantity}</td>
// 			</tr>
//       `
// 		);
// 	}

// 	return (
// 		`
// 	  <table class="table table-striped table-light table-bordered w-100">
// 	    <thead class="thead-dark">
// 	      <tr>
// 	        <th scope="col">Tên gói</th>
// 	        <th scope="col">Tên sản phẩm</th>
// 	        <th scope="col">Giá</th>
// 	        <th scope="col">Đơn vị tính</th>
// 	        <th scope="col">Số lượng tối đa</th>
// 	      </tr>
// 	    </thead>
// 	    <tbody> ` +
// 		`${tableData}` +
// 		`</tbody>
// 	  </table>
// 	`
// 	);
// };

// $(document).ready(function () {
// 	// pagination
// 	const paginationContainer = $('#pagination');
// 	if (paginationContainer.length) {
// 		pagination(paginationContainer, total, pageSize, currentPage, {
// 			showGoInput: true,
// 			showGoButton: true,

// 			// When click pagination item
// 			callback: () => {
// 				$('#pagination li:not(.disabled)').click(async function () {
// 					const page = $(this).attr('data-num');
// 					if (page == currentPage) return;
// 					location.href = ROOT_URL + generateQuery(page, sortList, search);
// 				});

// 				$('#pagination .paginationjs-go-button').click(function () {
// 					const input = $('.paginationjs-go-input input');
// 					const page = parseInt(input.val());
// 					if (isNaN(page) || page < 1 || page > Math.ceil(total / pageSize)) {
// 						input.val('');
// 						return;
// 					}
// 					location.href = ROOT_URL + generateQuery(page, sortList, search);
// 				});
// 			},
// 		});
// 	}

// 	// add sort class
// 	addSortClass(sortList);

// 	// sort icon click
// 	sortIconClick($('.sort-icon'), currentPage, sortList, search, (query) => {
// 		location.href = ROOT_URL + query;
// 	});

// 	// search button click
// 	$('#searchBtn:not(.disabled)').click(function () {
// 		const searchQuery = $('#searchInput').val().trim();
// 		if (!searchQuery) return;

// 		$(this).addClass('disabled');

// 		const href = `${ROOT_URL}${generateQuery(
// 			1,
// 			sortList
// 		)}&search=${searchQuery}`;

// 		location.href = href;
// 	});

// 	// Show package detail (show package modal)
// 	$('.info-icon').click(async function () {
// 		const packageId = $(this).attr('data-uuid');
// 		if (!packageId) return;

// 		const loading = $('#loading');
// 		const modalBody = $('#packageModalBody');
// 		const modal = $('#packageModal');

// 		// loading
// 		loading.removeClass('d-none');
// 		modalBody.empty();
// 		modal.fadeIn(200).modal('show');

// 		// fetch this package by packageId
// 		const packageRes = await fetch(
// 			`/management/product-packages/${packageId}`,
// 			{
// 				method: 'GET',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 			}
// 		);

// 		loading.addClass('d-none');

// 		if (packageRes.status === 200) {
// 			const package = await packageRes.json();
// 			modalBody.html(renderPackageDetails(package));
// 		} else {
// 			modalBody.html(
// 				'<div class="alert alert-danger">Lấy dữ liệu thất bại. Thử lại !</div>'
// 			);
// 		}
// 	});

// 	// show edit package modal
// 	$('select').selectize({
// 		shortField: 'text',
// 	});

// 	$('.edit-icon').click(async function () {
// 		const modal = $('#editModal');

// 		modal.removeClass('d-none');
// 		modal.fadeIn(200).modal('show');

// 		const productPackageId = $(this).attr('data-productPackageId');
// 		const productPackageName = $(this).attr('data-productPackageName');
// 		const limitedProducts = $(this).attr('data-limitedProducts');
// 		const limitedInDay = $(this).attr('data-limitedInDay');
// 		const limitedInWeek = $(this).attr('data-limitedInWeek');
// 		const limitedInMonth = $(this).attr('data-limitedInMonth');

// 		$('#currentPackageName').text(`( Hiện tại: ${productPackageName} )`);
// 		$('#currentLP').text(`( Hiện tại: ${limitedProducts} )`);
// 		$('#currentLID').text(`( Hiện tại: ${limitedInDay} )`);
// 		$('#currentLIW').text(`( Hiện tại: ${limitedInWeek} )`);
// 		$('#currentLIM').text(`( Hiện tại: ${limitedInMonth} )`);

// 		modal.attr('data-productPackageId', productPackageId);
// 		modal.attr('data-productPackageName', productPackageName);
// 		modal.attr('data-limitedProducts', limitedProducts);
// 		modal.attr('data-limitedInDay', limitedInDay);
// 		modal.attr('data-limitedInWeek', limitedInWeek);
// 		modal.attr('data-limitedInMonth', limitedInMonth);
// 	});

// 	$('#updateBtn').click(async function () {
// 		const toast = $('#toastMsg');
// 		const editModal = $('#editModal');

// 		const productPackageId = Number(editModal.attr('data-productPackageId'));
// 		console.log('productPackageId', productPackageId);

// 		let oldPackageName = editModal.attr('data-statusf');
// 		let newPackageName = $('#newPackageName').val()?.trim() || '';

// 		let oldLP = editModal.attr('data-limitedProducts');
// 		let newLP = $('#newLP').val();

// 		let oldLID = editModal.attr('data-limitedInDay');
// 		let newLID = $('#newLID').val();

// 		let oldLIW = editModal.attr('data-limitedInWeek');
// 		let newLIW = $('#newLIW').val();

// 		let oldLIM = editModal.attr('data-limitedInMonth');
// 		let newLIM = $('#newLIM').val();

// 		// Xu ly khi nhap khoang trang
// 		// if (newPackageName.match(/ /)) {
// 		// 	newPackageName = oldPackageName;
// 		// }

// 		// Update mot so thuoc tính
// 		if (newPackageName === '') {
// 			newPackageName = oldPackageName;
// 		}
// 		if (newLP === '') {
// 			newLP = oldLP;
// 		}
// 		if (newLID === '') {
// 			newLID = oldLID;
// 		}
// 		if (newLIW === '') {
// 			newLIW = oldLIW;
// 		}
// 		if (newLIM === '') {
// 			newLIM = oldLIM;
// 		}

// 		// Update Limit Product
// 		if (newLP !== '' && Number(newLP) > 1000) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm không được quá 1000',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLID !== '' && Number(newLID) > Number(newLIW)) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm ngày không được nhiều hơn tuần',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLID !== '' && Number(newLID) < 1) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm ngày không được nhỏ hơn 1',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLIW !== '' && Number(newLIW) > Number(newLIM)) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm tuần không được nhiều hơn tháng',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLIW !== '' && Number(newLIW) < 1) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm tuần không được nhỏ hơn 1',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLIM !== '' && Number(newLIM) > Number(newLP)) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm tháng không được nhiều hơn tổng Giới hạn',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		if (newLIM !== '' && Number(newLIM) < 1) {
// 			showToastMsg(
// 				toast,
// 				'Giới hạn SL sản phẩm tháng không được nhỏ hơn 1',
// 				'danger',
// 				4000
// 			);
// 			return;
// 		}

// 		$(this).addClass('disabled');

// 		const resJSON = await fetch('/management/product-packages/update', {
// 			method: 'PUT',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 				productPackageId,
// 				newPackageName,
// 				newLP,
// 				newLID,
// 				newLIW,
// 				newLIM,
// 			}),
// 		});

// 		if (resJSON.status === 200) {
// 			showToastMsg(toast, 'Cập nhật thành công', 'success', 1000);
// 			location.reload();
// 		} else {
// 			const { msg } = await resJSON.json();
// 			$(this).removeClass('disabled');
// 			showToastMsg(toast, msg || 'Cập nhật thất bại', 'danger', 3000);
// 		}
// 	});
// });

const PACKAGE_URL = '/api/packages';
const ROOT_URL = '/management/product-packages/list';
let page = 1,
	pageSize = 12;

const packageCard = ({
	productPackageId,
	productPackageName,
	totalPrice,
	thumbnail,
	products,
}) => {
	return `
  <div class="package-card">
    <a class="package-card__top" href="/management/product-packages/list/${productPackageId}">
      <img class="thumbnail" src="${thumbnail}" alt="${productPackageName}"
        onerror="this.onerror=null;this.src='https://res.cloudinary.com/tuan-cloudinary/image/upload/v1642031448/smarket/no-img.png'">
    </a>
    <div class="package-card__body">
      <a class="package-card__title" href="/package/${productPackageId}">${productPackageName}</a>
      <ul class="p-0">
        ${
					products &&
					products
						.map(
							(p) =>
								`<li class="product-item">
                  <span>${p.productName}</span>
                  <span class="text-gray">
                  ${formatCurrency(p.productPrice)} / ${p.productUnit}
                  </span>
                </li>`
						)
						.join('')
				}
      </ul>
      <p class="mt-auto package-card__price">
        <span class="price">
          ${formatCurrency(totalPrice)}
        </span>
      </p>
    </div>
    <div class="package-card__bottom">
      <button class="add-cart-btn btn btn-primary w-100 d-none" data-id=${productPackageId}>
        Thêm vào giỏ hàng
        <i class="bi bi-cart-plus"></i>
      </button>
    </div>
  </div>`;
};

const checkLimitPackage = async (packageId) => {
	const apiRes = await fetch(
		`/api/check-limit-package?packageId=${packageId}`,
		{
			method: 'GET',
			headers: {
				ContentType: 'application/json',
			},
		}
	);

	if (apiRes.status === 200) {
		return { isSuccess: true };
	}

	const { msg } = await apiRes.json();
	return { isSuccess: false, msg };
};

const onAddCartItem = () => {
	$('#packageList').on('click', '.add-cart-btn', async function () {
		const packageId = Number($(this).attr('data-id'));
		if (!packageId || isNaN(packageId)) return;

		const { isSuccess, msg } = await checkLimitPackage(packageId);
		if (isSuccess) {
			addToCart(packageId);

			$(this)
				.removeClass('btn-primary add-cart-btn')
				.addClass('btn-danger remove-cart-btn')
				.html('Xoá khỏi giỏ hàng <i class="bi bi-cart-dash-fill"></i>');
		} else {
			return showToastMsg($('#toastMsg'), msg, 'danger');
		}
	});
};

const onRemoveCartItem = () => {
	$('#packageList').on('click', '.remove-cart-btn', function () {
		const packageId = Number($(this).attr('data-id'));
		if (!packageId || isNaN(packageId)) return;
		$(this)
			.removeClass('btn-danger remove-cart-btn')
			.addClass('btn-primary add-cart-btn')
			.html('Thêm vào giỏ hàng <i class="bi bi-cart-plus-fill"></i>');
		removeCartItem(packageId);
	});
};

function getQuery(searchBy = searchKeyword) {
	const sortByPrice = Number($('#sortByPrice').val());
	const sortByName = Number($('#sortByName').val());
	let priceFrom = Number($('#priceFrom').val());
	let priceTo = Number($('#priceTo').val());

	if (priceFrom > priceTo && priceTo !== 0) {
		[priceFrom, priceTo] = [priceTo, priceFrom];
	}

	// currentPage & search get from server
	const searchQuery = searchBy !== '' ? `&search=${searchBy}` : '';
	const sortByNameQuery = sortByName !== -1 ? `&sortByName=${sortByName}` : '';
	const sortByPriceQuery =
		sortByPrice !== -1 ? `&sortByPrice=${sortByPrice}` : '';
	const priceFromQuery = priceFrom > 0 ? `&priceFrom=${priceFrom}` : '';
	const priceToQuery = priceTo > 0 ? `&priceTo=${priceTo}` : '';

	let url = `${ROOT_URL}?${searchQuery}${sortByNameQuery}${sortByPriceQuery}${priceFromQuery}${priceToQuery}`;
	url = url.replace('?&', '?');

	return url[url.length - 1] === '?' ? url.slice(0, url.length - 1) : url;
}

$(document).ready(function () {
	const viewMoreBtn = $('#viewMore');
	const packageList = $('#packageList');
	const loading = $('#loading');

	loadCart();
	checkCartAddedBtn();
	onAddCartItem();
	onRemoveCartItem();

	viewMoreBtn.click(async function () {
		viewMoreBtn.addClass('disabled');
		loading.removeClass('d-none');
		let query = location.search?.replace('?', '');
		if (query) query = `&${query}`;

		const apiRes = await fetch(
			`${PACKAGE_URL}?page=${++page}&pageSize=${pageSize}${query}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (apiRes.status === 200) {
			const { packages, total } = await apiRes.json();

			viewMoreBtn.removeClass('disabled');
			loading.addClass('d-none');

			packages.forEach((package) => {
				packageList.append(packageCard(package));
			});

			checkCartAddedBtn();

			if (page >= Math.ceil(total / pageSize)) {
				viewMoreBtn.remove();
			}
		}
	});

	$('#sortByName').change(function () {
		location.href = getQuery(searchKeyword);
	});

	$('#sortByPrice').change(function () {
		location.href = getQuery(searchKeyword);
	});

	$('#filterBtn').click(function () {
		const priceTo = Number($('#priceTo').val());
		const priceFrom = Number($('#priceFrom').val());
		if (priceTo === 0 && priceFrom === 0) {
			return;
		}

		location.href = getQuery(searchKeyword);
	});

	$('#destroySearch').click(function () {
		location.href = getQuery('');
	});

	$('#destroySearch').click(function () {});
});

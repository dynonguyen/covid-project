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

	$('#search').click(function () {
		const keyword = $('#searchInput').val()?.trim();
		if (!keyword) return;
		location.href = `/management/product-packages/list?keyword=${keyword}`;
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

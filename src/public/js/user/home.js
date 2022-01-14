const PACKAGE_URL = '/api/packages';
let page = 1,
	pageSize = 12;

const packageCard = ({
	productPackageId,
	productPackageName,
	thumbnail,
	products,
}) => {
	const totalPrice = products?.reduce((sum, p) => sum + p.productPrice, 0) || 0;
	return `
  <div class="package-card">
    <a class="package-card__top" href="/user/package/${productPackageId}">
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
      <button class="add-cart-btn btn btn-primary w-100" data-id=${productPackageId}>
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

$(document).ready(function () {
	const viewMoreBtn = $('#viewMore');
	const packageList = $('#packageList');
	const loading = $('#loading');
	const search = $('#search');

	loadCart();
	checkCartAddedBtn();
	onAddCartItem();
	onRemoveCartItem();

	viewMoreBtn.click(async function () {
		viewMoreBtn.addClass('disabled');
		loading.removeClass('d-none');

		const apiRes = await fetch(
			`${PACKAGE_URL}?page=${++page}&pageSize=${pageSize}&keyword=${searchKeyword}`,
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

	search.click(function () {
		const keyword = $('#searchInput').val()?.trim();
		if (!keyword) return;
		location.href = `${location.pathname}?keyword=${keyword}`;
	});
});

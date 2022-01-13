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
      <button class="btn btn-primary w-100">
        Thêm giỏ hàng
        <i class="bi bi-cart-plus"></i>
      </button>
    </div>
  </div>`;
};

$(document).ready(function () {
	const viewMoreBtn = $('#viewMore');
	const packageList = $('#packageList');
	const loading = $('#loading');

	viewMoreBtn.click(async function () {
		viewMoreBtn.addClass('disabled');
		loading.removeClass('d-none');

		const apiRes = await fetch(
			`${PACKAGE_URL}?page=${++page}&pageSize=${pageSize}`,
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

			if (page >= Math.ceil(total / pageSize)) {
				viewMoreBtn.remove();
			}
		}
	});
});

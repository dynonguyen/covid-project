/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />
const DEFAULT = {
	PAGE_SIZE: 8,
};

// show & hide toast message
function showToastMsg(toast, message = 'Message', type = '', timeout = 3000) {
	if (toast) {
		toast
			.html(`${message} <div class="close-icon">x</div>`)
			.addClass(`${type} show`);

		if (timeout !== 0) {
			setTimeout(() => {
				toast.removeClass(`${type} show`);
			}, timeout);
		}
	}
}

// generate pagination
// options - documentation: https://pagination.js.org/index.html
function pagination(
	selector,
	totalItems = 0,
	pageSize = DEFAULT.PAGE_SIZE,
	currentPage = 1,
	options = {}
) {
	if (selector) {
		selector.pagination({
			dataSource: new Array(totalItems).fill(true),
			pageSize,
			pageNumber: currentPage,
			pageRange: 1,
			autoHidePrevious: true,
			autoHideNext: true,
			...options,
		});
	}
}

// add sort icon class with sortList
function addSortClass(sortList = []) {
	$('.sort-icon').each(function () {
		const that = $(this);
		const dataSort = that.attr('data-sort');

		const index = sortList.findIndex((item) => item.indexOf(dataSort) !== -1);

		if (index === -1) return that.addClass('bi-sort-up');

		if (sortList[index].indexOf('DESC') !== -1)
			return that.addClass('bi-sort-down active');

		that.addClass('bi-sort-up active');
	});
}

// generate query
function generateQuery(page = 1, sortList = [], root = '') {
	let query = root + '?';
	query += `page=${page}`;

	// sortList: ['item1', 'items DESC', 'item3']
	if (sortList.length > 0) query += `&sort=`;

	sortList.forEach((item) => {
		const splited = item.split(' ');
		if (splited.length > 1) query += '-';
		query += splited[0];
		query += ',';
	});

	return query[query.length - 1] === ','
		? query.slice(0, query.length - 1)
		: query;
}

// sort icon click to generate query
function sortIconClick(selector, currentPage, sortList, callback) {
	selector.click(function () {
		const that = $(this);
		const dataSort = that.attr('data-sort');
		const newSortList = [...sortList];

		if (!that.hasClass('active')) {
			newSortList.push(dataSort);
		} else {
			const index = newSortList.findIndex((i) => i.indexOf(dataSort) !== -1);

			if (that.hasClass('bi-sort-down')) {
				// remove item in sortList
				if (index !== -1) {
					newSortList.splice(index, 1);
				}
			} else if (that.hasClass('bi-sort-up')) {
				if (index !== -1) {
					// Change sort type
					newSortList[index] = `${dataSort} DESC`;
				} else {
					// Add item into sortList
					newSortList.push(`${dataSort} DESC`);
				}
			}
		}

		const query = generateQuery(currentPage, newSortList);
		callback && callback(query);
	});
}

// auto register when DOM loaded
$(document).ready(function () {
	// Hide toast message
	$('.toast-msg').click(function () {
		$(this).removeClass('show danger warning');
	});

	// show & hide view password input
	$('.view-password-icon').click(function () {
		const that = $(this);
		const field = that.siblings('input.field');

		if (that.hasClass('bi-eye-fill')) {
			that.removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
			field.attr('type', 'password');
		} else {
			that.removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
			field.attr('type', 'text');
		}
	});
});

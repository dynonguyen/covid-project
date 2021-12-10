const SIDEBAR_STATUS = 'showSidebar';

// set cookie, value: string
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

$(document).ready(function () {
	const sidebar = $('#sidebar');

	// toggle sidebar
	$('#toggleSidebar').click(function () {
		sidebar.animate({ width: 'toggle' }, 150);

		if ($(this).hasClass('bi-layout-sidebar-inset')) {
			$(this)
				.removeClass('bi-layout-sidebar-inset')
				.addClass('bi-layout-sidebar-inset-reverse');

			setCookie(SIDEBAR_STATUS, '1', 7);
		} else {
			$(this)
				.removeClass('bi-layout-sidebar-inset-reverse')
				.addClass('bi-layout-sidebar-inset');

			setCookie(SIDEBAR_STATUS, '0', 7);
		}
	});

	// auto active menu item
	const pathname = window.location.pathname.replace('/management', '');
	$(`.menu-item[data-path="${pathname}"]`).addClass('active');

	// search user
	$('#navbarSearchIcon').click(function () {
		const searchQuery = $('#navbarSearch').val().trim();
		if (!searchQuery) return;

		$(this).addClass('disabled');

		const href = `/management/users/list?search=${searchQuery}`;

		location.href = href;
	});
});

$(document).ready(function () {
	const sidebar = $('#sidebar');

	// toggle sidebar
	$('#toggleSidebar').click(function () {
		sidebar.animate({ width: 'toggle' }, 150);

		if ($(this).hasClass('bi-layout-sidebar-inset')) {
			$(this)
				.removeClass('bi-layout-sidebar-inset')
				.addClass('bi-layout-sidebar-inset-reverse');
			showSidebar = true;
		} else {
			$(this)
				.removeClass('bi-layout-sidebar-inset-reverse')
				.addClass('bi-layout-sidebar-inset');
			showSidebar = false;
		}
	});

	// auto active menu item
	const pathname = window.location.pathname.replace('/management', '');
	$(`.menu-item[data-path="${pathname}"]`).addClass('active');
});

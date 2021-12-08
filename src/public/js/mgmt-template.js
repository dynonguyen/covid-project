/// <reference path="D:\typings\jquery\globals\jquery\index.d.ts" />

$(document).ready(function () {
	const sidebar = $('#sidebar');

	$('#toggleSidebar').click(function () {
		sidebar.animate({ width: 'toggle' }, 250);

		if ($(this).hasClass('bi-layout-sidebar-inset')) {
			$(this)
				.removeClass('bi-layout-sidebar-inset')
				.addClass('bi-layout-sidebar-inset-reverse');
		} else {
			$(this)
				.removeClass('bi-layout-sidebar-inset-reverse')
				.addClass('bi-layout-sidebar-inset');
		}
	});
});

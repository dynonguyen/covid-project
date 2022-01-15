$(document).ready(function () {
	const pathname =
		'/' +
		location.pathname
			.split('/')
			.filter((i) => Boolean(i))
			.join('/');

	$('.sidebar-item a').each(function () {
		if ($(this).attr('href') === pathname) {
			$(this).parents('.sidebar-item').addClass('active');
		}
	});
});

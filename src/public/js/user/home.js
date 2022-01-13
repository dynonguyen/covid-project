$(document).ready(function () {
	$('.products-slider').slick({
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		prevArrow: '<i class="bi bi-arrow-left-circle-fill slick-prev">',
		nextArrow: '<i class="bi bi-arrow-right-circle-fill slick-next">',
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 420,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});

	$('#scrollTop').click(function () {
		$('html, body').animate({ scrollTop: 0 }, 'slow');
	});
});

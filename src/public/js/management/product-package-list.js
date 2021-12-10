$(document).ready(function () {
	pagination($('#pagination'), total, pageSize, currentPage, {
		showGoInput: true,
		showGoButton: true,
	});

	// When click pagination item
	$('#pagination li:not(.disabled)').click(function () {
		const p = $(this).attr('data-num');
		console.log(p);
	});

	// Show products in package (package detail)
	$('#exampleModal').on('show.bs.modal', function (event) {
		let button = $(event.relatedTarget);
		let recipient = button.data('whatever');
		let modal = $(this);
		modal.find('.modal-title').text('Package ' + recipient);
		modal.find('.modal-body input').val(recipient);
		console.log($(this));
	});
});

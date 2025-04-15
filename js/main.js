$(document).ready(function () {
    // Initialize Bootstrap tooltips for elements with the data-toggle="tooltip" attribute
    $('[data-toggle="tooltip"]').tooltip();
});

function toolTipReset() {
    // Hide any visible tooltips
    $('.tooltip').tooltip('hide');
}

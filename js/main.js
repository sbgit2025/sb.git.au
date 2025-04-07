document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();
    document.getElementById("response-message").textContent = "Thank you for reaching out!";
});


// When the document is ready, initialize tooltips
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// Function to hide all active tooltips
function toolTipReset() {
    $('.tooltip').tooltip('hide');
}


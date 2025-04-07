// scroll_navigation_ui.js

// Constants
const MAX_OPACITY = 0.8;
const SECTION_DIVISOR = 4;
const SCROLL_OFFSET = -78;
const ACTIVE_CLASS = 'fas fa-star';
const INACTIVE_CLASS = 'far fa-star';

// Event Binding
$(window).on('load resize scroll', () => {
  fadeScrollReminders();
  updateSectionIndicators();
});

// Fade Scroll Indicators Based on Scroll Position
function fadeScrollReminders() {
  const scrollBottomDiff = $(document).height() - ($(window).innerHeight() + $(window).scrollTop()) - 120;
  const windowHeight = $(window).height();

  // Scroll-down navigator
  if (scrollBottomDiff < windowHeight) {
    let alpha = scrollBottomDiff / windowHeight;
    $('.scroll-down-navigator').css({ opacity: alpha * MAX_OPACITY });
  } else {
    $('.scroll-down-navigator').css({ opacity: MAX_OPACITY });
  }

  // To-top navigator
  const triggerHeight = windowHeight / SECTION_DIVISOR;
  if ($(window).scrollTop() > triggerHeight) {
    let alpha = ($(window).scrollTop() - triggerHeight) / triggerHeight;
    if (alpha > 1) alpha = 1;
    $('.to-top-navigator').css({ opacity: alpha * MAX_OPACITY });
  } else {
    $('.to-top-navigator').css({ opacity: 0 });
  }
}

// Check if an element is in the viewport
$.fn.isInViewport = function () {
  const top = $(this).offset().top;
  const bottom = top + $(this).outerHeight();
  const viewportTop = $(window).scrollTop();
  const viewportBottom = viewportTop + $(window).height();
  return bottom > viewportTop && top < viewportBottom;
};

// Scroll to the next section that is not currently visible
function scrollToNextSection() {
  let passedVisible = false;
  let done = false;

  $('.section-visual-boundry').each(function () {
    const id = $(this).attr('id');
    if (!done) {
      if ($(this).isInViewport()) {
        if (!passedVisible) passedVisible = true;
      } else if (passedVisible) {
        scrollToAnchor(id);
        done = true;
      }
    }
  });

  if (!done) scrollToAnchor('bottom-of-document');
}

// Scroll to the previous section
function scrollToPreviousSection() {
  let previousId = 'top-of-document';
  let visibleFound = false;
  let scrolled = false;

  $('.section-visual-boundry').each(function () {
    const id = $(this).attr('id');
    if (!scrolled) {
      if (!visibleFound) {
        if ($(this).isInViewport()) visibleFound = true;
        else previousId = id;
      } else {
        scrollToAnchor(previousId);
        scrolled = true;
      }
    }
  });

  if (!scrolled) scrollToAnchor(previousId);
}

// Smooth scroll to the section anchor
function scrollToAnchor(id) {
  const anchor = $("a[name='" + id + "']");
  $('html, body').animate({
    scrollTop: anchor.offset().top + SCROLL_OFFSET
  }, 'fast');
  toolTipReset();
}

// Hide tooltips
function toolTipReset() {
  $('[data-toggle="tooltip"]').tooltip('hide');
}

// Update UI section indicators
function updateSectionIndicators() {
  toolTipReset();

  $('.section-visual-boundry').each(function () {
    const id = $(this).attr('id');
    const indicator = $('#' + id + '-section-indicator');

    if ($(this).isInViewport()) {
      indicator.attr('class', ACTIVE_CLASS);
    } else {
      indicator.attr('class', INACTIVE_CLASS);
    }
  });
}

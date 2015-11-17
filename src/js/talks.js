document.addEventListener('DOMContentLoaded', function() {
  var homeAnimation = new PageAnimation(/^\/$/, 'book', 'animating-to-home-layout').enable();
  var pageAnimation = new PageAnimation(/^\/(author|ideas|faq|talks\/.+)$/, 'bg', 'animating-to-page-layout').enable();
});


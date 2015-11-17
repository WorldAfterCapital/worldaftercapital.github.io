document.addEventListener('DOMContentLoaded', function() {
  var homeAnimation = new PageAnimation(/^\/$/, 'book', 'animating-to-home-layout').enable();
  var talksAnimation = new PageAnimation(/^\/talks$/, 'bg', 'animating-to-talks-layout').enable();
  var pageAnimation = new PageAnimation(/^\/(author|ideas|faq|talks\/.+)$/, 'floating', 'animating-to-page-layout').enable();
});

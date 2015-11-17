document.addEventListener('DOMContentLoaded', function() {
  var homeAnimation = new PageAnimation(/^\/(author|talks|faq)\/?$/, 'book', 'animating-to-page-layout').enable();
  var talksAnimation = new PageAnimation(/^\/talks$/, 'bg', 'animating-to-talks-layout').enable();
});

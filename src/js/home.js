document.addEventListener('DOMContentLoaded', function() {
  var homeAnimation = new PageAnimation(/^\/(author|talks|faq)\/?$/, 'bg', 'animating-to-page-layout').enable();
  var talksAnimation = new PageAnimation(/^\/talks$/, 'book', 'animating-to-talks-layout').enable();
});

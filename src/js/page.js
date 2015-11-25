document.addEventListener('DOMContentLoaded', function() {
  var MOBILE_WIDTH = 768;

  var md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile() === null) {
    var homeAnimation = new PageAnimation(/^\/$/, 'book', 'animating-to-home-layout', {
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },

    }).enable();
    var talksAnimation = new PageAnimation(/^\/talks$/, 'bg', 'animating-to-talks-layout', {
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },

    }).enable();
    var pageAnimation = new PageAnimation(/^\/(author|ideas|faq|talks\/.+)$/, 'floating', 'animating-to-page-layout', {
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },

    }).enable();
  }
});

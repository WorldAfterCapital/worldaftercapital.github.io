document.addEventListener('DOMContentLoaded', function() {
  var MOBILE_WIDTH = 768;

  var md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile() === null) {
    var homeAnimation = new PageAnimation(/^\/(author|talks|faq)\/?$/, 'bg', 'animating-to-page-layout', {
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },

    }).enable();
    var talksAnimation = new PageAnimation(/^\/talks$/, 'book', 'animating-to-talks-layout', {
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },

    }).enable();
  }
});

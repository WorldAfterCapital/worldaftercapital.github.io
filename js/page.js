document.addEventListener('DOMContentLoaded', function() {
  var MOBILE_WIDTH = 768;

  var md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile() === null) {
    new PageAnimation({
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },
    }).register(/^\/$/, 'book', 'animating-to-home-layout')
      .register(/^\/talks$/, 'bg', 'animating-to-talks-layout')
      .register(/^\/faq$/, 'page-title', 'animating-to-faq-layout')
      .register(/^\/author$/, 'page-title', 'animating-to-author-layout')
      .register(/^\/talks\/.+$/, 'page-title', 'animating-to-talk-layout')
      .enable();
  }
});

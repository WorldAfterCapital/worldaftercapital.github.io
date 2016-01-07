document.addEventListener('DOMContentLoaded', function() {
  var MOBILE_WIDTH = 768;

  var md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile() === null) {
    new PageAnimation({
      shouldAnimate: function() {
        return window.innerWidth > MOBILE_WIDTH;
      },
    }).register(/^\/talks$/, 'book', 'animating-to-talks-layout')
      .register(/^\/faq$/, 'bg', 'animating-to-faq-layout')
      .register(/^\/author$/, 'bg', 'animating-to-author-layout')
      .register(/^\/talks\/.+$/, 'bg', 'animating-to-talk-layout')
      .enable();
  }
});

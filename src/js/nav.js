document.addEventListener('DOMContentLoaded', function() {
  var MOBILE_WIDTH = 640;
  var nav = document.getElementById('nav');
  var ham = document.getElementById('ham');
  var body = document.getElementsByTagName('body')[0];

  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  ham.addEventListener('click', function(e) {
    if (hasClass(nav, 'open')) {
      nav.className = nav.className.replace(' open', '');
      body.className = body.className.replace(' nav-open', '');
    } else {
      PageAnimation.scrollToTop(200, function() {
        nav.className += ' open';
        body.className += ' nav-open';
      });
    }
  });
});

(function(global) {
  'use strict';

  function AnimationException(message) {
    this.message = message;
    this.name = 'AnimationException';
  }

  /**
   * Find the CSS transition end event that we should listen for.
   *
   * @returns {string} t - the transition string
   */
  function _whichTransitionEndEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      MSTransition: 'msTransitionEnd',
      OTransition: 'otransitionend',
      transition: 'transitionend',
    };
    for (t in transitions) {
      if (transitions.hasOwnProperty(t)) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }

  function _getTargetPath(e) {
    var url;
    if (e.target.href) {
      url = e.target.href;
    }

    for (var i = 0; i < e.path.length; i++) {
      if (e.path[i].href) {
        url = e.path[i].href;
      }
    }

    var path = url.replace(window.location.origin, '');
    console.log(url, path);
    return path;
  }

  function PageAnimation(urlRegex, finalElementId, bodyClass, callbacks) {

    this.cb = {
      shouldAnimate: callbacks.shouldAnimate || function() { return true; },
    };

    this.bodyClass = bodyClass;
    this.finalElement = document.getElementById(finalElementId);
    this.links = document.getElementsByTagName('a');
    this.transitionEndEvent = _whichTransitionEndEvent();
    this.inAnimation = false;
    this.body = document.getElementsByTagName('body')[0];
    this.reg = new RegExp(urlRegex);

    if (!this.finalElement) {
      throw new AnimationException('No element with ID ' + finalElementId);
    }

    if (this.links.length === 0) {
      throw new AnimationException('No links found in page.');
    }

    return this;
  }

  PageAnimation.prototype.onTransitionEnd = function(e) {
    if (this.inAnimation) {
      window.location = this.targetUrl;
    }
  };

  PageAnimation.prototype.onClick = function(e) {
    var path = _getTargetPath(e);
    if (!this.inAnimation && this.reg.test(path) && this.cb.shouldAnimate()) {
      e.preventDefault();
      this.inAnimation = true;
      PageAnimation.scrollToTop(200, function() {

        this.targetUrl = path;
        this.body.className = this.bodyClass;
      }.bind(this));
    }
  };

  PageAnimation.prototype.enable = function() {
    // Click listeners
    this.boundOnClick = this.onClick.bind(this);
    for (var i = 0; i < this.links.length; i++) {
      this.links[i].addEventListener('click', this.boundOnClick);
    }

    // Transition end listener
    this.boundOnTransitionEnd = this.onTransitionEnd.bind(this);
    this.finalElement.addEventListener(this.transitionEndEvent, this.boundOnTransitionEnd);
  };

  PageAnimation.prototype.disable = function() {
    for (var i = 0; i < this.links.length; i++) {
      this.links[i].removeEventListener('click', this.boundOnClick);
    }

    this.finalElement.removeEventListener(this.transitionEndEvent, this.boundOnTransitionEnd);
  };

  PageAnimation.scrollToTop = function(scrollDuration, cb) {
    var scrollHeight = window.scrollY;
    var scrollStep = Math.PI / (scrollDuration / 15);
    var cosParameter = scrollHeight / 2;
    var scrollCount = 0;
    var scrollMargin;
    requestAnimationFrame(step);

    function step() {
      setTimeout(function() {
        if (window.scrollY !== 0) {
          requestAnimationFrame(step);
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          window.scrollTo(0, (scrollHeight - scrollMargin));
        } else {
          cb();
        }
      }, 15);
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(PageAnimation);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageAnimation;
  } else {
    global.PageAnimation = PageAnimation;
  }

}(this));

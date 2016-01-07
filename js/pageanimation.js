(function(global) {
  'use strict';

  function PageAnimationException(message) {
    this.message = message;
    this.name = 'PageAnimationException';
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
    } else {
      for (var i = 0; i < e.path.length; i++) {
        if (e.path[i].href) {
          url = e.path[i].href;
        }
      }
    }

    var path = url.replace(window.location.origin, '');
    return path;
  }

  function PageAnimation(callbacks) {

    this.cb = {
      shouldAnimate: callbacks.shouldAnimate || function() { return true; },
    };

    this.animations = {};
    this.body = document.getElementsByTagName('body')[0];
    this.transitionEndEvent = _whichTransitionEndEvent();
    this.links = document.getElementsByTagName('a');
    this.inAnimation = false;
    this.boundOnTransitionEnd = this.onTransitionEnd.bind(this);
    this.boundOnClick = this.onClick.bind(this);

    if (this.links.length === 0) {
      throw new PageAnimationException('No links found in page.');
    }

    return this;
  }

  PageAnimation.prototype.register = function(urlRegex, finalElementId, bodyClass) {
    // Create the animation
    var animation = {
      bodyClass: bodyClass,
      finalElement: document.getElementById(finalElementId),
      regex: new RegExp(urlRegex),
    };

    // Error checking
    if (!animation.finalElement) {
      throw new PageAnimationException('No element with ID ' + finalElementId);
    }

    // Regsiter event listener and animation
    this.animations[urlRegex] = animation;

    return this;
  };

  PageAnimation.prototype.deregister = function(urlRegex) {
    if (!this.animations[urlRegex]) {
      throw new PageAnimationException('No animation registered with regex ' + urlRegex);
    }

    // Deregister the animation
    delete this.animations[urlRegex];

    return this;
  };

  PageAnimation.prototype.onTransitionEnd = function(e) {
    if (this.inAnimation) {
      window.location = this.targetUrl;
    }
  };

  PageAnimation.prototype.animate = function(animation, path) {
    animation.finalElement.addEventListener(this.transitionEndEvent, this.boundOnTransitionEnd);
    this.inAnimation = true;
    PageAnimation.scrollToTop(200, function() {
      this.targetUrl = path;
      this.body.className = animation.bodyClass;
    }.bind(this));
  };

  PageAnimation.prototype.onClick = function(e) {
    var path = _getTargetPath(e);

    // Only animate if we are not in another animation, we should animate, and
    // we're not just supposed to refresh the page.
    if (!this.inAnimation &&
        this.cb.shouldAnimate() &&
        path !== window.location.pathname) {
      for (var urlRegex in this.animations) {
        if (this.animations.hasOwnProperty(urlRegex) && this.animations[urlRegex].regex.test(path)) {
          e.preventDefault();
          this.animate(this.animations[urlRegex], path);
          return;
        }
      }
    }
  };

  PageAnimation.prototype.enable = function() {
    for (var i = 0; i < this.links.length; i++) {
      this.links[i].addEventListener('click', this.boundOnClick);
    }
  };

  PageAnimation.prototype.disable = function() {
    for (var i = 0; i < this.links.length; i++) {
      this.links[i].removeEventListener('click', this.boundOnClick);
    }
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

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

  function PageAnimation(finalElementId, options) {
    var opts = options || {};
    this.settings = {
      linkClass: opts.linkClass || 'animate',
      bodyClass: opts.bodyClass || 'animating-to-page-layout',
      beforeAnimate: opts.beforeAnimate || null,
      timeout: 3000,
    };

    this.finalElement = document.getElementById(finalElementId);
    this.links = document.getElementsByClassName(this.settings.linkClass);
    this.transitionEndEvent = _whichTransitionEndEvent();
    this.inAnimation = false;
    this.body = document.getElementsByTagName('body')[0];
    console.log(this.links);

    if (!this.finalElement) {
      throw new AnimationException('No element with ID ' + finalElementId);
    }

    if (this.links.length === 0) {
      throw new AnimationException('No links found with class ' + this.settings.linkClass);
    }

    return this;
  }

  PageAnimation.prototype.onTransitionEnd = function(e) {
    window.location = this.targetUrl;
  };

  PageAnimation.prototype.onClick = function(e) {
    e.preventDefault();
    if (!this.inAnimation) {
      this.inAnimation = true;

      if (this.settings.beforeAnimate) {
        console.log('running');
        this.settings.beforeAnimate();
      }

      this.targetUrl = e.target.href;
      this.body.className = 'animating-to-page-layout';
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

  if (typeof define === 'function' && define.amd) {
    define(PageAnimation);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageAnimation;
  } else {
    global.PageAnimation = PageAnimation;
  }

}(this));

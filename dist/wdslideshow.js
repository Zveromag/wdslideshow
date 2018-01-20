/***Autor Zveerko; GitHub (https://github.com/Zveromag/wdslideshow)***/
(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) { }
        return i > -1;
      };
  }
})();
(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();

(function (window) {

  'use strict';

  function getCss3Prop(prefixProp) {
    var element = document.documentElement;
    var prefix = ['-o-', '-webkit-', '-moz-', ''];

    function camelCase(str) {
      return str.replace(/\-([a-z])/gi, function (match, $1) {
        return $1.toUpperCase();
      });
    }

    for (var i = prefix.length - 1; i >= 0; i--) {
      var prefixProp = camelCase(prefix[i] + prefixProp);
      if (prefixProp in element.style) {
        return prefixProp;
      }
    }

    return false;
  }
  function transitionEnd() {
    var el = document.body;

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }

    return false;
  }
  function extend(defaults, obj) {
    for (var key in obj) {
      if (defaults.hasOwnProperty(key)) {
        defaults[key] = obj[key];
      }
    }

    return defaults;
  }
  function SlideShow(options) {

    this.currentImg = 0;
    this.isAnimate = false;

    this.initEvent = this.init.bind(this);
    this.closeWindow = this.close.bind(this);
    this.hideWrap = this.hide.bind(this);
    this.resize = this.resize.bind(this);
    this.move = this.move.bind(this);
    this.keyEvents = this.keyEvents.bind(this);


    this.option = extend(SlideShow.settings, options);

    document.body.addEventListener('click', this.initEvent);
  }
  SlideShow.settings = {
    arrows: true,
    caption: true,
    keyboard: true,
    onChange: function () { }
  }
  SlideShow.prototype.init = function (e) {
    var target = e.target.closest('[data-wdgal]');

    if (!target) return;

    var value = target.dataset.wdgal;
    var allImages = Array.prototype.slice.call(document.querySelectorAll('[data-wdgal="' + value + '"]'));

    //bind events
    this.album = allImages.map(function (img) {
      return {
        'source': img.dataset.src,
        'caption': img.dataset.caption,
      };
    });

    for (var i = 0; i < allImages.length; i++) {
      if (allImages[i] === target) {
        this.currentImg = i;
      }
    }

    this.render();
    this.show();
  }
  SlideShow.prototype.render = function () {
    this.mainWindow = document.createElement('div');
    this.mainWindow.className = 'slideshow';

    var template = '<div class="slideshow__body">' +
      '<button class="slideshow__icon-close"></button>' +
      '<div class="slideshow__preload"><div></div></div>' +
      (this.album.length > 1 && this.option.arrows
        ?
        '<div class="slideshow__navigation">' +
        '<button class="slideshow__arrow slideshow__arrow-prev"></button>' +
        '<button class="slideshow__arrow slideshow__arrow-next"></button>' +
        '</div>'
        : ''
      )
      + '<div class="slideshow__img-wrap"></div>' +
      '</div>';

    this.mainWindow.innerHTML = template;

    this.slideBody = this.mainWindow.querySelector('.slideshow__body');
    this.close = this.mainWindow.querySelector('.slideshow__icon-close');
    this.preload = this.mainWindow.querySelector('.slideshow__preload');
    this.imgWrap = this.slideBody.querySelector('.slideshow__img-wrap');

    if (this.album.length > 1 && this.option.arrows) {
      this.control = this.mainWindow.querySelector('.slideshow__navigation');
      this.navigate();
    }

    this.caption = this.album[this.currentImg]['caption'];
  }
  SlideShow.prototype.show = function (index) {

    if (this.isAnimate) return;

    var self = this;
    self.isAnimate = true;

    var image = new Image();
    image.className = 'slideshow__img';

    self.imgWrap.style.opacity = 0;

    image.onload = function () {
      self.hideWrap();
      self.imgWrap.appendChild(image);
      self.imgWidth = image.naturalWidth;
      self.imgHeight = image.naturalHeight;

      self.resize();

      setTimeout(function () {
        self.imgWrap.style.opacity = 1;
      }, 0)

      self.imgWrap.addEventListener(transitionEnd(), function handler(e) {
        self.imgWrap.removeEventListener(e.type, handler);
        self.isAnimate = false;
      });
    };
    image.src = this.album[this.currentImg]['source'];

    if (self.option.caption) {
      self.showCaption();
    }

    window.addEventListener('resize', this.resize);
    document.body.appendChild(this.mainWindow);

    if (this.album.length > 1 && this.option.keyboard) {
      document.body.addEventListener('keyup', this.keyEvents);
    }
    this.close.addEventListener('click', this.closeWindow);
  }
  SlideShow.prototype.showCaption = function () {
    if (this.caption !== 'undefined' && this.caption !== '') {
      this.captionBlock = document.createElement('div');
      this.captionBlock.className = 'slideshow__caption';
      this.captionBlock.textContent = this.caption;
      this.slideBody.appendChild(this.captionBlock);
    }
  }
  SlideShow.prototype.resize = function () {
    var self = this;
    var wh = window.innerHeight - 100;
    var ww = window.innerWidth - 100;

    var ratio = Math.min(
      ww / self.imgWidth,
      wh / self.imgHeight
    );

    if (ratio > 1) ratio = 1;

    this.imgWrap.querySelector('img').style[getCss3Prop('transform')] = 'translate(-50%, -50%) scale(' + ratio + ')';
  }
  SlideShow.prototype.hide = function () {
    if (this.option.caption) {
      if (this.captionBlock) {
        this.captionBlock.parentNode.removeChild(this.captionBlock);
      }
    }
    if (this.imgWrap.querySelector('img')) {
      this.imgWrap.removeChild(this.imgWrap.querySelector('img'));
    }
  }
  SlideShow.prototype.navigate = function (evt) {
    this.control.addEventListener('click', this.move);
  }
  SlideShow.prototype.move = function (move) {
    if (this.isAnimate) return;

    if (move.type === 'keyup') {
      if (move.which === 37) {
        this.prevSlide();
      }
      else {
        this.nextSlide();
      }
    }
    else {
      if (move.target.closest('.slideshow__arrow').classList.contains('slideshow__arrow-next')) {
        this.nextSlide();
      }
      else {
        this.prevSlide();
      }
    }

    var self = this;
    self.isAnimate = true;
    self.imgWrap.style.opacity = 0;
    self.imgWrap.addEventListener(transitionEnd(), function handler(e) {
      self.imgWrap.removeEventListener(e.type, handler);
      self.isAnimate = false;
      self.show(); //короче это в первую очередь надо отрефакторить, после тестов
    });
  }
  SlideShow.prototype.nextSlide = function () {
    if (this.album.length > this.currentImg + 1) {
      this.currentImg += 1;
    }
    else {
      this.currentImg = 0;
    }
  }
  SlideShow.prototype.prevSlide = function () {
    if (this.currentImg > 0) {
      this.currentImg -= 1;
    }
    else {
      this.currentImg = this.album.length - 1;
    }
  }
  SlideShow.prototype.close = function () {
    // remove events
    this.close.removeEventListener('click', this.closeWindow);
    if (this.album.length > 1 && this.option.arrows) {
      this.control.removeEventListener('click', this.move);
    }
    if (this.option.keyboard) {
      document.body.removeEventListener('keyup', this.keyEvents);
    }

    //remove vars
    this.mainWindow.parentNode.removeChild(this.mainWindow);
    this.mainWindow = null;
  }
  SlideShow.prototype.keyEvents = function (key) {
    var num = key.which;
    if (num === 39 || num === 37) {
      this.move(key);
    }
    if (num === 27) {
      this.closeWindow();
    }
  }
  SlideShow.prototype.destroy = function () {
    // remove events
    this.close.removeEventListener('click', this.closeWindow);
    if (this.album.length > 1 && this.option.arrows) {
      this.control.removeEventListener('click', this.move);
    }
    if (this.option.keyboard) {
      document.body.removeEventListener('keyup', this.keyEvents);
    }
    window.removeEventListener('resize', this.resize);
    document.body.removeEventListener('click', this.bindEvent);

    //remove vars
    this.mainWindow.parentNode.removeChild(this.mainWindow);

    for (var key in this) {
      delete this[key];
    }
  }

  window.WDSlideShow = SlideShow;

})(this)

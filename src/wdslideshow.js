//*******version 1.0
(function($) {

  'use strict';

// Prefix helper
  function getCss3Prop(prefixProp) {

    var element = document.documentElement;
    var prefix = ['-o-', '-webkit-', '-moz-', ''];

    function camelCase(str) {
      return str.replace(/\-([a-z])/gi, function(match, $1) {
        return $1.toUpperCase();
      });
    }

    for (var i = prefix.length - 1; i >= 0; i--) {
      var prefixProp = camelCase(prefix[i] + prefixProp);
      if(prefixProp in element.style) {
        return prefixProp;
      }
    }

    return false;
  }

  var PLUGINNAME = 'WDSlideShow';

  $.fn[PLUGINNAME] = function(options) {

    var $body = $(document.body);
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">' +
        							'<path d="M524 500L985 39c6.7-6.6 6.7-17.3 0-24-6.7-6.7-17.4-6.7-24 0L500 476 39 15c-6.6-6.6-17.4-6.6-24 0-6.7 6.7-6.7 17.4 0 24l461 461L15 961c-6.7 6.6-6.7 17.3 0 24 3.3 3.3 7.7 5 12 5 4.4 0 8.7-1.7 12-5l461-461 461 461c3.2 3.3 7.6 5 12 5s8.6-1.7 12-5c6.6-6.7 6.6-17.4 0-24L524 500z"/>' +
        						'</svg>';
    var arrowLeftIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">' +
      										'<path d="M736.4 11.4c-3.4 1.3-436.6 418.2-484.2 466-14 13.8-15 15.3-15 23 0 7.3 1.2 9.2 12 20 11 11 466 450.4 480.3 463.8 13 12 33.2 4 33.2-13.4 0-9 10.3 1.4-260.8-260.4C383 596 286 501.6 285.5 500.8c-.2-.8 105-103.2 233.7-227.6C648.3 148.7 755.6 44.4 758 41.5c12.4-14.6-4.3-37.4-21.6-30z"/>' +
      									'</svg>';
    var arrowRightIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">' +
      										'<path d="M249.7 11.8c-6.5 2.6-12.3 11.3-12.3 18.7 0 8.7-13.8-5 257 256.3C615 403.4 713.7 499.4 713.7 500.4s-106.6 105-237 230.8c-130.3 126-237.5 230.4-238 232.3-2.7 7-1.4 14.4 4 20.4 4.4 4.8 7 6 13.6 6 7 0 9.4-1.2 17-8.6C333 924.4 742 529.7 751 520.7c10.7-11 12-12.8 12-20 0-7.6-1-9.3-14-22-52-52-482-465.6-485.7-467-5.6-2.2-8-2.2-13.3 0z"/>' +
      									'</svg>';
    var options = $.extend({
      arrowRightIcon : arrowRightIcon,
      arrowLeftIcon : arrowLeftIcon,
      closeIcon : closeIcon,
      infinite : true,
      imageDesc : true
    }, options);
  	var templateDesc = '<div class="wd-slideshow__desc"></div>';
    var template = '<div class="wd-slideshow">' +
                   	'<div class="wd-slideshow__body">' +
                    	'<div class="wd-slideshow__preloader"><div></div></div>' +
                      '<i class="wd-slideshow__close">'+ options.closeIcon +'</i>' +
                      	'<div class="wd-slideshow__arrows">' +
                        	'<span class="wd-slideshow__arrow wd-slideshow__arrow--left">' +
                          	options.arrowLeftIcon +
                          '</span>' +
                          '<span class="wd-slideshow__arrow wd-slideshow__arrow--right">' +
                            options.arrowRightIcon +
                          '</span>' +
                        '</div>' +
                        '<div class="wd-slideshow__img"></div>' +
                      '</div>' +
                    '</div>';

    var KEYS = {
      ESC: 27,
      LEFT: 37,
      RIGHT: 39
    };

    var transition = getCss3Prop('transition');

    return this.each(function() {

      var $container = $(this);
      var $item = $container.find('.gl-slideshow__item');
      var itemCount = $item.length - 1;
      var index = 0;
      var imgStyle;
      var $img;
      var $close;
      var $arrowLeft;
      var $arrowRight;
      var $slideshow;
      var $imgDesc;

// Create slideshow window
      function create(source) {

// Current index
        index = $(this).index();

// Append template
        hideScroll();
        $body.append(template);

// SlideShow variables
        $slideshow = $('.wd-slideshow');
        $close = $slideshow.find('.wd-slideshow__close');
        $img = $slideshow.find('.wd-slideshow__img');
        $arrowLeft = $slideshow.find('.wd-slideshow__arrow--left');
        $arrowRight = $slideshow.find('.wd-slideshow__arrow--right');
        imgStyle = $img[0].style;


// Show descriptions
        if(options.imageDesc) {
        	$img.append(templateDesc);
          $imgDesc = $slideshow.find('.wd-slideshow__desc');
        }

// Show gallery
        show(index);

// Bind events
        $arrowLeft.on('click.' + PLUGINNAME, imgPrev);
        $arrowRight.on('click.' + PLUGINNAME, imgNext);
        $close.one('click.' + PLUGINNAME, remove);

        $(document).on('keydown.' + PLUGINNAME, function(evt) {
          var key = evt.which;

          if(key === KEYS.ESC) {
             $close.trigger('click');
          }

          if(key === KEYS.LEFT) {
            if(!options.infinite) {
              if(index === 0) return;
            }
            $arrowLeft.trigger('click');
          }
         if(key === KEYS.RIGHT) {
            if(!options.infinite) {
              if(index === itemCount) return;
            }
            $arrowRight.trigger('click');
          }

        })

      }

// Navigation
      function imgPrev() {
        show(index - 1);
      }

      function imgNext() {
        show(index + 1);
      }

// Hidescroll body
      function hideScroll() {
        var wa = $body.outerWidth(true);
	      $body.addClass('wd-slideshow-is-active');
	      var wh = $body.outerWidth(true);

        if(wh != wa) {
					$body.css('padding-right', wh - wa + 'px');
				}

      }

// Show image
      function show(i) {

        index = (i > itemCount) ? 0 : i;

        if(index < 0) {
        	index = itemCount;
        }

				// infinite settings
        if(!options.infinite) {

        	$arrowLeft.show();
          $arrowRight.show();

          if(index === itemCount) {
          	$arrowRight.hide();
          }
          else if(index === 0) {
          	$arrowLeft.hide();
          }
        }


      	var src = $item.eq(index).data('src');
        var desc = $item.eq(index).data('desc');
        var img = new Image();

        imgStyle[transition] = 'none';
        imgStyle.opacity = 0;

        img.onload = function() {

          imgStyle[transition] = '';

        if(options.imageDesc) {

          if(desc !== undefined && desc.trim() !== '') {
            $imgDesc.text(desc).show();
          }
          else {
            $imgDesc.hide();
          }

        }


          setTimeout(function() {
            imgStyle.backgroundImage = 'url(' + src + ')';
            imgStyle.opacity = 1;
          }, 50)

        }
        img.src = src;
      }

// Remove slideshow
      function remove() {

        if($body.hasClass('wd-slideshow-is-active')) {

          $body.css('padding-right', '').removeClass('wd-slideshow-is-active');

          $arrowLeft.off('.' + PLUGINNAME);
        	$arrowRight.off('.' + PLUGINNAME);
          $(document).off('.' + PLUGINNAME);

          $slideshow.remove();

// Clear all vars
        	index = null;
          $slideshow = null;
          $close = null;
          $img = null;
          $arrowLeft = null;
          $arrowRight = null;
          imgStyle = null;
					$imgDesc = null;
        }

      }

      $item.on('click', create);

    });

  }

})(jQuery);

$('.gl-slideshow').WDSlideShow();
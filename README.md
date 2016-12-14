#WD SlideShow

##Description

This plugin is a slide show that can be used in any project.

##Initialization

````javaScript
$('.gl-slideshow').slideShow();
````

##Demo
````html
<div class="gl-slideshow">
  <div class="gl-slideshow__item" style="background-image:url('images/slide_1.jpg')" data-src="images/slide_1.jpg" data-desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat, in!"></div>
  <div class="gl-slideshow__item" style="background-image:url('images/slide_2.jpg')" data-src="images/slide_2.jpg" data-desc=""></div>
  <div class="gl-slideshow__item" style="background-image:url('images/slide_3.jpg')" data-src="images/slide_3.jpg"></div>
  <div class="gl-slideshow__item" style="background-image:url('images/slide_4.jpg')" data-src="images/slide_4.jpg"></div>
  <div class="gl-slideshow__item" style="background-image:url('images/slide_5.jpg')" data-src="images/slide_5.jpg"></div>
</div>
````
[view demo](http://codepen.io/Zveromag/pen/QGqWoj)

##Options

defaults values

````javaScript
//it allows you to change the appearance of controls
arrowRightIcon : 'image'
arrowLeftIcon : 'image'
closeIcon : 'image'

//this parameter is responsible for the cyclical scrolling images in a slide show
infinite : true

//adds a description to slides data-desc=""
imageDesc : true
````

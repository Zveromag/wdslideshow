#WD SlideShow

##Description

This plugin is a slide show that can be used in any project.

##Initialization

This plugin is a slide show that can be used in any project.

````javaScript
$('.gl-slideshow').slideShow();
````

##Demo
````html
<div class="gl-slideshow">
  <div class="gl-slideshow__item" style="background-image:url('http://www.3dnews.ru/assets/external/illustrations/2015/04/09/912424/gta%205%20pc%2006.jpg')" data-src="http://www.3dnews.ru/assets/external/illustrations/2015/04/09/912424/gta%205%20pc%2006.jpg" data-desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat, in!"></div>
  <div class="gl-slideshow__item" style="background-image:url('http://images.vfl.ru/ii/1448907594/117084e2/10659840.jpg')" data-src="http://images.vfl.ru/ii/1448907594/117084e2/10659840.jpg" data-desc=""></div>
  <div class="gl-slideshow__item" style="background-image:url('http://arabhardware.net/wp-content/uploads/2015/04/4k1fOI9HRBy7.jpg')" data-src="http://arabhardware.net/wp-content/uploads/2015/04/4k1fOI9HRBy7.jpg"></div>
  <div class="gl-slideshow__item" style="background-image:url('https://i.ytimg.com/vi/0jfiWFAY_NE/maxresdefault.jpg')" data-src="https://i.ytimg.com/vi/0jfiWFAY_NE/maxresdefault.jpg"></div>
  <div class="gl-slideshow__item" style="background-image:url('http://elitefon.ru/images/201211/elitefon.ru_8755.jpg')" data-src="http://elitefon.ru/images/201211/elitefon.ru_8755.jpg"></div>
</div>
````
##Options

defaults values

````javaScript
//it allows you to change the appearance of controls
arrowRightIcon : 'image'
arrowLeftIcon : 'image'
closeIcon : 'image'

//this parameter is responsible for the cyclical scrolling images in a slide show
infinite : true

//responsible for setting the show description for each image. For each image might specify a description, by creating attribute data.
imageDesc : true
````

````html
data-desc="This is image description"
````
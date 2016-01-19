## Front end nano degree neighbourhood map project

This project is for udacity front-end nano-degree web developer. It's a neighborhood map of Boston MA, with some interested locations, you can search to filter locations or click marker or list item to show interested location's related flickr photos and wikipedia links. It's github page is [here](http://songshu189.github.io/p5-neighborhood-map/).

### Project implementation introduction

This project uses jQuery to select required html elements, uses knockoutjs to implement the Model-View-ViewModel pattern, these two libraries are linked with outside CDN links. The project also uses FlexSlider 2 responsive slider to show location related flickr photos, the required css and js files are in respective folders.

### How did I complete this Project?

The repository contains css, and js folders, as well as an index.html and a README.md file.
* The **css** folder contains a 'style.css' file which is used for styling the map page, there are media queries in this file to make this project run on various computers and mobile devices. There are also one 'fonts' folder and 'flexslider.css' which are from [flexslider 2](http://flexslider.woothemes.com/).
* The **js** folder contains 'libs' folder which is from [flexslider 2](http://flexslider.woothemes.com/), and 'script.js' which is the "ViewModel" for implementing the logic of this project. The following are those functionality of the project has implemented: 
 * Full-screen map (function initMap())
 * Create map marker(Location class, line 97-101)
 * Display map marker (function resetMarkers line 84-88)
 * Knockout observable searchItem (line 152)
 * Filter markers (knockout computed observable array resultList, which is filtering available locations according to user input)
 * List view of the set of locations (the above resultList)
 * The other third-party APIs (flickr photos: line 182-331, wikipedia links: line 333-391)
 * Animate map marker(line 113-116)
 * Show info window(line 119-120)
 * Error Handling, for flickr photos search, error handling code is in getJSON error processing function and when json.stat is not "ok", for wikipedia links search, use setTimeout function.
* The **index.html** file is the "View", knockout data-binds are in here: hamburger icon click event(line 15), user input search item(line 19), locations list view(line 26-28), locations list click event(line 27), flickr photos responsive slider list(line 38-39, 63), wikipedia list(line 44-46), google map marker info window content(line 57-58).

### How to run this project

 * Install this project

    `$ git clone https://github.com/songshu189/p5-neighborhood-map.git`

 * Open **index.html** in browser, the input search box is on the top-left, input any text, then instantly location list views and markers on the map are filtered. Click list items or click markers on the map, infowindow pop up and related flickr photos and wiki links are shown. For landscape mode display, list views are in the left, with small device width, list views are floating in the left, but not show, click the hamburger button, then it is show, when device width very small, list views floating in the top. For portrait mode display, list views are in the top, with decreased device height, list views are floating in the top, but not show, click the hamburger button, then it is show, when device height very small, list views floating in the top.
 
###References

1. [knockoutjs documentation](http://knockoutjs.com/documentation/introduction.html)
2. [The Flickr Developer Guide: API](https://www.flickr.com/services/developer/api/)
3. [MediaWiki APIs](https://www.mediawiki.org/wiki/API:Main_page)
4. [FlexSlider 2 The best responsive slider](http://flexslider.woothemes.com/)
5. [Knockout loses bindings when Google Maps API v3 info window is close](http://stackoverflow.com/questions/15317796/knockout-loses-bindings-when-google-maps-api-v3-info-window-is-closed)
6. [CSS3 Loading Animation Loop](http://www.alessioatzeni.com/blog/css3-loading-animation-loop/)
7. [Make div's vertically fit inside parent div, with a scrollbar on one](http://stackoverflow.com/questions/28685362/make-divs-vertically-fit-inside-parent-div-with-a-scrollbar-on-one)
8. [Smoothing out div scrolling in Mobile WebKit Browsers](http://weblog.west-wind.com/posts/2013/Jun/01/Smoothing-out-div-scrolling-in-Mobile-WebKit-Browsers)
9. [Click function for :hover states on touch devices](https://css-tricks.com/forums/topic/click-function-for-hover-states-on-touch-devices/)
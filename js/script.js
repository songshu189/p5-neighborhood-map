var model = [{
    name: 'Harvard Square',
    addr: '18 Brattle St #352, Cambridge, MA 02138',
    Lat: 42.373109,
    Lng: -71.120248,
    info: 'It is the historic center of Cambridge.'
}, {
    name: 'Massachusetts Institute of Technology',
    addr: '77 Massachusetts Ave, Cambridge, MA 02139',
    Lat: 42.359254,
    Lng: -71.093134,
    info: 'A private research university, modern and postmodern architecture, a living museum of works by noted architects'
}, {
    name: 'Union Oyster House',
    addr: '41 Union St, Boston, MA 02108',
    Lat: 42.361260,
    Lng: -71.056880,
    info: 'Historic eatery serving chowder & other New England seafood standards since 1826.'
}, {
    name: 'Fenway Park',
    addr: '4 Yawkey Way, Boston, MA 02215',
    Lat: 42.345844,
    Lng: -71.098782,
    info: 'Fenway Park is a baseball park Kenmore Square,it has been the home of the Boston Red Sox sincen 1912.'
}, {
    name: 'Museum of Science',
    addr: '1 Science Park, Boston, MA 02114',
    Lat: 42.367799,
    Lng: -71.070808,
    info: 'Exhibits in this extensive science museum encourage learning through hands-on exploration of science and technology.'
}, {
    name: 'New England Aquarium',
    addr: '1 Central Wharf, Boston, MA 02110',
    Lat: 42.359239,
    Lng: -71.049189,
    info: 'A global leader in ocean exploration and marine conservation.'
}, {
    name: 'Faneuil Hall',
    addr: '1 Faneuil Hall Sq, Boston, MA 02109',
    Lat: 42.360133,
    Lng: -71.055555,
    info: 'Faneuil Hall Marketplace, one of the nations premier urban marketplaces, is a popular attraction in Boston.'
}, {
    name: 'Boston College',
    addr: '140 Commonwealth Avenue, Chestnut Hill, MA 02467',
    Lat: 42.340064,
    Lng: -71.166876,
    info: "A private Jesuit Catholic research university located in the village of Chestnut Hill, Massachusetts"
}, {
    name: 'Museum of Fine Arts',
    addr: '465 Huntington Ave, Boston, MA 02115',
    Lat: 42.339457,
    Lng: -71.094143,
    info: "Explore one of the most comprehensive museums in the world with art from ancient Egyptian to contemporary"
}];

var map = null,
    infowindow = null,
    markers = [],
    firstclick = true;
    currentname = '',
    lastname = '';

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infowindow = new google.maps.InfoWindow();

    if (!localStorage.neighborMap) {
        localStorage.neighborMap = JSON.stringify({});
    }
    ko.applyBindings(new ViewModel());
}

// Hide all markers 
function clearMarkers() {
    for (var i=0; i<markers.length; i++) {
        markers[i].setMap(null);
    }
}

// Show only those markers in filtered locations list
function resetMarkers(locations) {
    for(var i=0; i<locations.length; i++) {
       locations[i].marker.setMap(map);
    }
}

function placeMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
  });
  infowindow.open(map,marker);
}

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}

var Location = function(data) {
    this.data = data;

    this.position = new google.maps.LatLng(data.Lat, data.Lng);
    
    this.marker=new google.maps.Marker({
                        position: this.position,
                        title: data.name,
                        map: map
                    });
};

// Return a function to show the marker and infowindow of the location
var showInfoWindow = function(location, self) {
    return function() {
        self.currentLocation(location);

        self.getotherapidata(location);
        
        // Let the marker bounce once
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            location.marker.setAnimation(null);
            }, 700); // current maps duration of one bounce (v3.13)
        
        // Set the infowindow content
        infowindow.setContent($('#marker-info').html());
        infowindow.open(map, location.marker);
    };
};

var ViewModel = function() {
    var self = this;

    var neighborMap = JSON.parse(localStorage.neighborMap);
    
    var bounds = new google.maps.LatLngBounds();
    var locations = [];//ko.observableArray();
    
    for(var i=0; i<model.length; i++) {
        var location = new Location(model[i]);
        
        markers.push(location.marker);
        locations.push(location);
        bounds.extend(location.position);
        
        google.maps.event.addListener(location.marker, 'click', showInfoWindow(location, self));

        map.fitBounds(bounds);
    }
    
    self.currentLocation = ko.observable(locations[0]);

    self.searchItem = ko.observable('');
    
    self.showInfoWindow = function(data) {
        showInfoWindow(data, self)();
    };
    
    self.resultList = ko.computed(function(){
        var filtered = ko.utils.arrayFilter(locations, function(location){
                var searchItem = self.searchItem().toLowerCase();
                return location.data.name.toLowerCase().indexOf(searchItem) >= 0;
            });
        
        clearMarkers();
        resetMarkers(filtered);
        return filtered;
    });

    self.flickrimgurl = ko.observable('');
    self.flickrimgsrc = ko.observable('');
    self.wikilist = ko.observableArray();
    self.flickrimglist = ko.observableArray();

    self.getotherapidata = function(location) {

        function resetSlider(imglist, flickrheader) {
            if(imglist.length>0 && lastname !== currentname) {
                $('#flexslider').removeData("flexslider");
                $('.flex-control-nav').remove();
                $('.flex-direction-nav').remove();
                $('#slides').html('');
            }
            $flickrHeader.text(flickrheader);
            self.flickrimglist(imglist);

            $('#flexslider').flexslider({ slideshow: false, controlNav: false});

            $('#searchicon').toggleClass('searchicon loading');
            if(firstclick) {
                if($('#locations-container').is(':hidden')) $('#locations-container').show();
                $('#detail-container').show();
                firstclick = false;
            }
            lastname = currentname;
        }
        
        function processPhotoSearch(json) {

            if(json.stat != 'ok') {
                resetSlider([], 'Failed to get flickr images');
                return;
            }
            
            var photos = json.photos.photo;
            var photos_len = photos.length;
            
            cc=0;
            for(var i=0; i<photos_len; i++){
                var sizeurl = flickrsizeurl + apikey + '&photo_id=' + photos[i].id + format;

                // Find the available width and height of related photo
                $.getJSON(sizeurl)
                 .done(function(sizes) {
                    processSizes(sizes, photos_len);
                 })
                 .error(function() {
                 });
            }
            
            if(photos_len==0) {
                resetSlider([], 'Relevant Flickr Images(None)');
            }
        }
        
        function processSizes(sizes, nn) {

            if(sizes.stat!='ok') {
                return ;
            }
                
            var imgsizes = sizes.sizes.size;

            // find the index of those image with width closest to 500
            var idx = 0, diff0=1000, diff=0;
            for(var j=0; j<imgsizes.length; j++) {
                if(imgsizes[j].media.toLowerCase() == "photo") {
                    diff = Math.abs(imgsizes[j].width - 500);
                    if(diff < diff0) {
                        diff0 = diff;
                        idx = j;
                    }
                }
            }
                        
            cc += 1;
                        
            // Do not show photos height great than width
            if(parseInt(imgsizes[idx].width) > (imgsizes[idx].height))
                imglist.push(imgsizes[idx].source);

            // Update observableArray only after all photos checked
            if(cc == nn) {
                if(neighborMap[name]) {
                    neighborMap[name].flickr = imglist;
                }
                else {
                    neighborMap[name] = {'flickr': imglist};
                }
                localStorage.neighborMap = JSON.stringify(neighborMap);
                resetSlider(imglist, 'Relevant Flickr Images');
            }
        }
               
        $('#searchicon').toggleClass('searchicon loading');

        // Search flickr to find photos related to the location
        
        var addr = location.data.addr;
        var result = /,((\s\w*\s?\w+),\s[A-Z]{2})/g.exec(addr);

        var citystate = result[1];
        var city = result[2];
        var name = location.data.name;
        currentname = name;
        var savedInfo = neighborMap[name];
        
        var imglist = [];
        var cc = 0;
        console.log(savedInfo);
        if(savedInfo && savedInfo['flickr']) {
            resetSlider(savedInfo['flickr'], 'Relevant Flickr Images' );
        }
        else {
            searchFlickr();
        }
        
        function searchFlickr() {
            var placefindurl = flickrfindurl + apikey + '&query=' + name + citystate + format;

            // Search the place_id of the location to narrow photo search results
            $.getJSON(placefindurl)
            .done(function (json) {

                if(json.stat != 'ok') {
                    resetSlider([], 'Failed to get flickr images');
                    return ;
                }
                var pid = json.places.place[0].place_id;
                var photosearchurl = flickrsearchurl + apikey + '&text=' + name + citystate +
                        '&place_id=' + pid + '&per_page=6' + format;
            
                // Search photos with place_id and name of the place
                $.getJSON(photosearchurl)
                 .done(function(data) {
                    processPhotoSearch(data);
                })
                .error(function() {
                    resetSlider([], 'Failed to get flickr images');
                });
            })
            .error(function(data) {
                resetSlider([], 'Failed to get flickr images');
            });
        }

        var wikiRequestTimeout = setTimeout(function() {
            self.wikilist([]);
            $wikiHeader.text('Failed to get wikipedia resources');
        }, 8000);

        if(savedInfo && savedInfo['wiki']) {
            resetWiki(savedInfo['wiki'], 'Relevant Wikipedia Links');
            return;
        }
        
        wikiSearch(name + city);
        
        function wikiSearch(search) {
            var wikiURL = wikisearchurl + search + '&format=json&callback=wikiCallback';

            $.ajax({
                url: wikiURL,
                dataType: 'jsonp',
                success: function(data) {
                    // do something with data
                    var title = data[1];
                    var link = data[3];
                    if(link.length == 0) {
                        if(search == name) {
                            resetWiki([], 'Relevant Wikipedia Links(None)');
                        }
                        else {
                            wikiSearch(name);
                        }
                    }
                    else {
                        
                        var wikilist = [];
                        var wklen = Math.min(4, link.length);
                        for(var i=0; i<wklen; i++) {
                            wikilist.push({link:link[i], title:title[i]});
                        }
 
                        if(neighborMap[name]) {
                            neighborMap[name].wiki = wikilist;
                        }
                        else {
                            neighborMap[name] = {'wiki': wikilist};
                        }
                        localStorage.neighborMap = JSON.stringify(neighborMap);
                        resetWiki(wikilist, 'Relevant Wikipedia Links');
                    }
                }
            });
        }
        
        function resetWiki(wikilist, wikiheader) {
            $wikiHeader.text(wikiheader);
            self.wikilist(wikilist);
            clearTimeout(wikiRequestTimeout);
        }
	};
};

function showLocations() {
    //$('#locations-container').toggleClass('show-list');
    $('#locations-container').toggle();
    if(firstclick==false) {
        $('#detail-container').toggle();
    }
    //$('#detail-container').toggleClass('show-detail');
}

var flickrfindurl = 'https://api.flickr.com/services/rest/?method=flickr.places.find';
var flickrsearchurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
var flickrsizeurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes';
var apikey = '&api_key=b6fdb508d51ea1e2f7fab29e76cb6fc1';
var format = '&format=json&nojsoncallback=1';
var wikisearchurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';
var $flickrHeader = $('#flickr-header');
var $wikiHeader = $('#wikipedia-header');

$( "#locations-container" ).mouseleave(function() {
   $(this).removeClass('show-list');
});
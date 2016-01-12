model = [
    {name: 'Harvard Square',
     addr: '18 Brattle St #352, Cambridge, MA 02138',
     Lat: 42.373109,
     Lng: -71.120248,
     info: 'It is the historic center of Cambridge.'},
     {name: 'Massachusetts Institute of Technology',
     addr: '77 Massachusetts Ave, Cambridge, MA 02139',
     Lat: 42.359254,
     Lng: -71.093134,
     info: 'A private research university, modern and postmodern architecture, a living museum of works by noted architects'},
     {name: 'Union Oyster House',
     addr: '41 Union St, Boston, MA 02108',
     Lat: 42.361260,
     Lng: -71.056880,
     info: 'Historic eatery serving chowder & other New England seafood standards since 1826.'},
     {name: 'Fenway Park',
     addr: '4 Yawkey Way, Boston, MA 02215',
     Lat: 42.345844,
     Lng: -71.098782,
     info: 'Fenway Park is a baseball park Kenmore Square,it has been the home of the Boston Red Sox sincen 1912.'},
     {name: 'Museum of Science',
     addr: '1 Science Park, Boston, MA 02114',
     Lat: 42.367799,
     Lng: -71.070808,
     info: 'Exhibits in this extensive science museum encourage learning through hands-on exploration of science and technology.'},
     {name: 'New England Aquarium',
     addr: '1 Central Wharf, Boston, MA 02110',
     Lat: 42.359239,
     Lng: -71.049189,
     info: 'A global leader in ocean exploration and marine conservation.'},
     {name: 'Faneuil Hall',
     addr: '1 Faneuil Hall Sq, Boston, MA 02109',
     Lat: 42.360133,
     Lng: -71.055555,
     info:'Faneuil Hall Marketplace, one of the nations premier urban marketplaces, is a popular attraction in Boston.'},
     {name: 'Boston College',
     addr: '140 Commonwealth Avenue, Chestnut Hill, MA 02467',
     Lat: 42.340064,
     Lng: -71.166876,
     info: "A private Jesuit Catholic research university located in the village of Chestnut Hill, Massachusetts"},
     {name: 'Museum of Fine Arts',
     addr: '465 Huntington Ave, Boston, MA 02115',
     Lat: 42.339457,
     Lng: -71.094143,
     info: "Explore one of the most comprehensive museums in the world with art from ancient Egyptian to contemporary"}
];
    
var map = null,
    infowindow = null;
    markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infowindow = new google.maps.InfoWindow();
    ko.applyBindings(new ViewModel());
}

// Hide all markers 
function clearMarkers() {
    for(var i=0; i<markers.length; i++) {
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
    }
    
    self.resultList = ko.computed(function(){
        var filtered = ko.utils.arrayFilter(locations, function(location){
                var searchItem = self.searchItem().toLowerCase();
                //console.log(searchItem);
                return location.data.name.toLowerCase().indexOf(searchItem) >= 0;
            });
            //console.log(filtered);
        
        clearMarkers();
        resetMarkers(filtered);
        return filtered;
    });
    self.backToList = function() {
        $("#detail-container").hide();
        $('#locations-container').show();
    }
    self.flickrimgurl = ko.observable('');
    self.flickrimgsrc = ko.observable('');
    self.wikilist = ko.observableArray();
    self.flickrimglist = ko.observableArray();
    
    self.getotherapidata = function(location) {

        $('#searchicon').toggleClass('searchicon loading');

        // Search flickr to find photos related to the location
        
        var addr = location.data.addr;
        var result = /,(\s\w*\s?\w+,\s[A-Z]{2})/g.exec(addr);
        var name = location.data.name + ',' + result[1];
        var placefindurl = flickrfindurl + apikey + '&query=' + name + format;
        
        var imglist = [];
        
        // Search the place_id of the location to narrow photo search results
        $.getJSON(placefindurl, function (json) {
            var pid = json.places.place[0].place_id;
            var photosearchurl = flickrsearchurl + apikey + '&text=' + name 
                        + '&place_id=' + pid + '&per_page=6' + format;
            
            // Search photos with place_id and name of the place
            $.getJSON(photosearchurl, function (json) {
                var photos = json.photos.photo;

                var cc=0;
                for(var i=0; i<photos.length; i++){
                    var sizeurl = flickrsizeurl + apikey + '&photo_id=' + photos[i].id + format;;

                    // Find the available width and height of related photo
                    $.getJSON(sizeurl, function (sizes) {
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
                        if(cc == photos.length) {
                            
                            self.flickrimglist.removeAll();
                            $('#flexslider').removeData("flexslider");
                            $('.flex-control-nav').remove();
                            $('.flex-direction-nav').remove();
                            $('#slides').html('');
                            
                            self.flickrimglist(imglist);

                            $('#flexslider').flexslider({ slideshow: false});

                            $('#detail-container').show();
                            $('#searchicon').toggleClass('searchicon loading');
                            $('#locations-container').hide();
                        }
                    });
                }
            });
        });
        
        var wikiRequestTimeout = setTimeout(function() {
            self.wikilist().removeAll();
            self.wikilist().push({link:'#', title:'failed to get wikipedia resources'});
        }, 8000);
        
        var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' 
                    + location.data.name + '&format=json&callback=wikiCallback';
    
        
        $.ajax({
            url: wikiURL,
            dataType: 'jsonp',
            success: function(data) {
                // do something with data
                var title = data[1]
                var link = data[3];
                self.wikilist.removeAll();
                for(var i=0; i<link.length; i++) {
                    //console.log(title[i], link[i]);
                    self.wikilist.push({link:link[i], title:title[i]});
                }
                clearTimeout(wikiRequestTimeout);
            }
        });
	};
};

var flickrfindurl = 'https://api.flickr.com/services/rest/?method=flickr.places.find';
var flickrsearchurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
var flickrsizeurl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes';
var apikey = '&api_key=b6fdb508d51ea1e2f7fab29e76cb6fc1';
var format = '&format=json&nojsoncallback=1';
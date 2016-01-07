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
     {name: 'Museum of Sience',
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
     addr: '465 Huntington Ave Boston, MA 02115',
     Lat: 42.339457,
     Lng: -71.094143,
     info: "Explore one of the most comprehensive museums in the world with art from ancient Egyptian to contemporary"}
     
];
    

var map = null,
    markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
}

function setMarkers(locations) {
  var bounds = new google.maps.LatLngBounds();
  var infowindow = new google.maps.InfoWindow(), i = 0;
  
  // Add the markers and infowindows to the map
  for (; i < locations.length; i++) {
    var location = locations[i];
    var position = new google.maps.LatLng(location.Lat, location.Lng);
    bounds.extend(position);
    
    var marker=new google.maps.Marker({
      position: position,
      title: location.name,
      map: map
    });
    console.log(marker);
    markers.push(marker);
    
    google.maps.event.addListener(marker, 'click', (function(marker, info) {
      return function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700); // current maps duration of one bounce (v3.13)
        infowindow.setContent(info);
        infowindow.open(map, marker);
      }
    })(marker, location.info));
    
    map.fitBounds(bounds);
  }
}

function resetMarkers(locations) {
    var i=0, j=0, set=false, marker=null;
    
    for(; i<markers.length; i++) {
        marker = markers[i];
        set = false;
        for(j=0; j<locations.length; j++) {
            if(marker.title == locations[j].name) {
                set = true;
                break;
            }
        }
        marker.setMap(set?map:null);
    }
}

function clearMarkers() {
    var marker=null, i=0;
    for(; i<markers.length; i++) {
        marker = markers[i];
        marker.setMap(null);
    }
    
    markers = [];
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

var ViewModel = function() {
    var self = this;
    
    initMap();
    setMarkers(model);
    
    self.locations= ko.observableArray(model);
    self.searchItem = ko.observable('');
    
    self.resultList = ko.computed(function(){
        var filtered = ko.utils.arrayFilter(self.locations(), function(location){
                var searchItem = self.searchItem().toLowerCase();
                console.log(searchItem);
                return location.name.toLowerCase().indexOf(searchItem) >= 0;
            });
            //console.log(filtered);
        
        //clearMarkers();
        resetMarkers(filtered);
        return filtered;
    });
};

//google.maps.event.addDomListener(window, 'load', initMap);



ko.applyBindings(new ViewModel());
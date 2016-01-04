model = [
    {name: 'Harvard Square',
     Lat: 42.372958,
     Lng: -71.062594,
     info: 'It is the historic center of Cambridge.'},
     {name: 'Massachusetts Institute of Technology',
     Lat: 42.359100,
     Lng: -71.093400,
     info: 'A private research university, modern and postmodern architecture, a living museum of works by noted architects'},
     {name: 'Union Oyster House',
     Lat: 42.360082,
     Lng: -71.058880,
     info: 'Historic eatery serving chowder & other New England seafood standards since 1826.'},
     {name: 'Fenway Park',
     Lat: 42.340394,
     Lng: -71.094886,
     info: 'Fenway Park is a baseball park Kenmore Square,it has been the home of the Boston Red Sox sincen 1912.'},
     {name: 'Museum of Sience',
     Lat: 42.367799,
     Lng: -71.070808,
     info: 'Exhibits in this extensive science museum encourage learning through hands-on exploration of science and technology.'},
     {name: 'New England Aquarium',
     Lat: 42.359239,
     Lng: -71.049189,
     info: 'A global leader in ocean exploration and marine conservation.'},
     {name: 'Faneuil Hall',
     Lat: 42.360133,
     Lng: -71.055555,
     info:'Faneuil Hall Marketplace, one of the nations premier urban marketplaces, is a popular attraction in Boston.'},
     {name: 'Pizzeria Regina',
     Lat: 42.356119,
     Lng: -71.132499,
     info: "Boston's best pizza since 1926"}];
    

var map;
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 
  var bounds = new google.maps.LatLngBounds();
  var infowindow = new google.maps.InfoWindow(), i = 0;
  
  // Add the markers and infowindows to the map
  for (var i = 0; i < model.length; i++) {
    var location = model[i];
    var position = new google.maps.LatLng(location.Lat, location.Lng);
    bounds.extend(position);
    
    var marker=new google.maps.Marker({
      position: position,
      title: location.name
    });

    marker.setMap(map);
  
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

google.maps.event.addDomListener(window, 'load', initMap);
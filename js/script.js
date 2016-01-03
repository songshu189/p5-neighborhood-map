var map;
function initMap() {
  
  var myCenter=new google.maps.LatLng(42.372958, -71.062594);
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  console.log(map);
  
  var marker=new google.maps.Marker({
    position: myCenter,
    title: 'Click to zoom'
    //animation:google.maps.Animation.BOUNCE
  });
  
  var infowindow = new google.maps.InfoWindow({
    content: "Hello World!"
  });

  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  marker.setMap(map);
  
  // Zoom to 9 when clicking on marker
  google.maps.event.addListener(marker,'click',function() {
    map.setZoom(9);
    map.setCenter(marker.getPosition());
  });
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
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('carte'), {
    center: {lat: 48.866667, lng: 2.333333},
    zoom: 15
  });
}
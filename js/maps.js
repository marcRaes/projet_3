// Définition d'une fonction AJAX génerique
// Celle-ci permettra de récupérer la liste des stations
function ajaxGet(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
          // Appelle la fonction callback en lui passant la réponse de la requête
          callback(req.responseText);
      } else {
          console.error(req.status + " " + req.statusText + " " + url);
      }
  });
  req.addEventListener("error", function () {
      console.error("Erreur réseau avec l'URL " + url);
  });
  req.send(null);
}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('carte'), {
    center: {lat: 48.866667, lng: 2.333333},
    zoom: 15
  });

  // Appel de la requéte AJAX et récuperation de la liste des stations
  ajaxGet("https://api.jcdecaux.com/vls/v1/stations?apiKey=8d964b828792e1a92da605f34933f01cc0f27098", function (reponse) {
    var listeStations = JSON.parse(reponse);
    // Récupere la liste de la position des stations
    listeStations.forEach(function (listePositions) {
      // Positionne les marqueurs sur la carte
      var marqueur = new google.maps.Marker({
        position: new google.maps.LatLng(listePositions.position),
        map : map
      });
    })
});

}
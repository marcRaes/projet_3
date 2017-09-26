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

// Fonction d'insertion de la carte google maps
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
        listeStations.forEach(function (station) {
            // Positionne les marqueurs sur la carte
            var marqueur = new google.maps.Marker({
                position: new google.maps.LatLng(station.position),
                map : map,
                title: station.name
            });

            // Ajoute un évenement aux marqueurs
            google.maps.event.addListener(marqueur, 'click', function() {

                // Insertion des infos sur la station
                document.getElementById("nomStation").insertAdjacentHTML("beforeend", "<strong>" + station.name + "</strong>"); // Nom de la station
                document.getElementById("adresseStation").insertAdjacentHTML("beforeend", "<strong>" + station.adress + "</strong>"); // Adresse de la station
                document.getElementById("etatStation").insertAdjacentHTML("beforeend", "<strong>" + station.status + "</strong>"); // Etat de la station
                document.getElementById("veloDispo").insertAdjacentHTML("beforeend", "<strong>" + station.available_bikes + "</strong>"); //  Nombre de vélos disponibles et opérationnels
                document.getElementById("attacheDispo").insertAdjacentHTML("beforeend", "<strong>" + station.bike_stands + "</strong>"); //  Nombre de points d'attache opérationnels
                // /Insertion des infos sur la station

                var infoStation = document.getElementById("infoStation");
                infoStation.style.display = "block"; // Fait apparaitre le cadre d'info sur la station
            });
        });
    });

}
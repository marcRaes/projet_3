// Cache les différents blocs de réservation
document.getElementById("infoStation").style.display = "none";
document.getElementById("containerCanvas").style.display = "none";

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
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=paris&apiKey=8d964b828792e1a92da605f34933f01cc0f27098", function (reponse) {
        var listeStations = JSON.parse(reponse);
        // Récupere la liste de la position des stations
        listeStations.forEach(function (station) {
            // Positionne les marqueurs sur la carte
            var marqueur = new google.maps.Marker({
                map: map,
                position: station.position
              });

            // Ajoute un évenement lors du clique sur un marqueur
            google.maps.event.addListener(marqueur, 'click', function() {
                // Insertion des infos sur la station
                // Nom de la station
                document.getElementById("nomStation").innerHTML = "";
                document.getElementById("nomStation").innerHTML = station.name;
                // Adresse de la station
                document.getElementById("adresseStation").innerHTML = "";
                document.getElementById("adresseStation").innerHTML = station.address;
                // Etat de la station
                document.getElementById("etatStation").innerHTML = "";
                if(station.status === "OPEN") {
                    document.getElementById("etatStation").innerHTML = "OUVERT";
                } else {
                    document.getElementById("etatStation").innerHTML = "FERMER";
                    document.getElementById("etatStation").style.color = "red";
                }

                // Insertion du nom de la station dans le cadre de réservation
                document.getElementById("containerCanvas").querySelector("strong").innerHTML = station.name;
                
                //  Nombre de vélos disponibles et opérationnels à la station
                if(station.available_bikes === 0) {
                    document.getElementById("veloDispo").style.color = "red";
                }
                document.getElementById("veloDispo").innerHTML = "";
                document.getElementById("veloDispo").innerHTML = station.available_bikes;

                //  Nombre de points d'attache opérationnels à la station
                document.getElementById("attacheDispo").innerHTML = "";
                document.getElementById("attacheDispo").innerHTML = station.available_bike_stands;
                // /Insertion des infos sur la station

                // Street View
                var streetView = new google.maps.StreetViewPanorama(document.getElementById("streetView"),{
                    position: station.position,
                    linksControl: false,
                    panControl: false
                });

                // Insertion du nom de la station dans le cadre de réservation
                document.getElementById("containerCanvas").querySelector("strong").innerHTML = station.name;

                // Insertion du nom dans la section de réservation
                document.getElementById("messageLocation").querySelector("strong").innerHTML = station.name;

                var infoStation = document.getElementById("infoStation");
                infoStation.style.display = "block"; // Fait apparaitre le cadre d'info sur la station
                document.getElementById("containerCanvas").style.display = "none"; // Fait disparaitre le canvas si celui-ci à était affiché
            });
            var signature = document.getElementById("infoStation").querySelector("button");
            signature.addEventListener("click", function(){
                document.getElementById("containerCanvas").style.display = "block";
                window.scrollTo(0,900);
            });
        });
    });
}
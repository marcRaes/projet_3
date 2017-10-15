// Cache la section de location
document.getElementById("sectionLocation").style.display = "none";

// Objet maps  ==>  La carte Google maps ainsi que les marqueurs
var maps = {
    lat : 48.875224, // Lattitude de la carte
    long : 2.350479, // Longitude de la carte
    iconBase : "./images/marqueurs/default_marqueur.png", // Icone de marqueur
    tableauMarqueur : [], // Tableau ou serons inserer les differents marqueurs, cela servira à les rassembler (marker Clusterer)

    // Méthode d'insertion de la carte Google
    initMap : function() {
        map = new google.maps.Map(document.getElementById('carte'), {
            center : { lat: this.lat, lng: this.long}, // Insertion des coordonées de position de la carte
            zoom : 16 // Zoom de la carte
        });
    },

    // Méthode d'integration des marqueurs sur la carte Google
    initMarqueur : function(positionStation) {
        marqueur = new google.maps.Marker({
            map : map,
            icon: this.iconBase,
            position : positionStation // Désigne la position de chaque marqueurs
        });
        this.tableauMarqueur.push(marqueur); // Stocke les marqueurs dans un tableau qui sera utiliser par "markerClusterer"
    },

    // Méthode pour l'attribution d'une image de marqueur pour les stations ouverte et fermer
    iconMarqueur : function(statusStation) {
        if(statusStation === "OPEN") {
            this.iconBase = "./images/marqueurs/marqueur_ouvert.png";
        } else if(statusStation === "CLOSED") {
            this.iconBase = "./images/marqueurs/marqueur_fermer.png";
        }
    },

    // Méthode pour le regroupement de marqueurs
    regroupementMarqueurs : function() {
        marqueurCluster = new MarkerClusterer(map, this.tableauMarqueur,
        {
            imagePath : "./images/marqueurs/m"
        });
    },

    // Street View
    vueRue : function() {
        streetView = new google.maps.StreetViewPanorama(document.getElementById("streetView"),{
            position: station.positionStation,
            linksControl: false,
            panControl: false
        });
    }
};

// Objet Station
var station = {
    // Attributs
    nom : null,
    adresse : null,
    etat : null,
    nbVelo : null,
    nbAttache : null,
    positionStation : null,
    emplacementDonnees : document.getElementById("listeInfo").querySelectorAll("span"),
    tableauDonnees : [],
    autorisation : null,

    // Méthode Ajax qui permettra de récuperer la liste des stations velib'
    ajaxGet : function(url, callback) {
        req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", function() {
            if (req.status >= 200 && req.status < 400) {
                // Appelle la fonction callback en lui passant la réponse de la requête
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function() {
            console.error("Erreur réseau avec l'URL " + url);
        });
        req.send(null);
    },

    // Méthode de traitement des données de la station 
    
    traitementDonneesStation : function(donneesStation) {
        this.nom = donneesStation.name;
        this.addresse = donneesStation.address;
        this.etat = donneesStation.status;
        this.nbVelo = donneesStation.available_bikes;
        this.nbAttache = donneesStation.available_bike_stands;
        this.positionStation = donneesStation.position;
    },

    insertionDonneesStation : function() {
        this.tableauDonnees = [this.nom, this.addresse, this.etat, this.nbVelo, this.nbAttache];
        // traitement pour inserer les données
        for(var i = 0; i <= this.emplacementDonnees.length; i++) {
            this.emplacementDonnees[i].innerHTML = this.tableauDonnees[i]; // Insert les données de la station selectionner
        }
    },

    // Méthode qui autorise ou non la réservation
    autorisationReservation : function() {
        if(this.etat === "CLOSED") { // Si la Station est fermer
            this.etat = "FERMER"; // Traduction du texte
            document.getElementById("etatStation").style.color = "red"; // Le champs d'état de la station sera marquer en rouge
            document.getElementById("veloDispo").style.color = "red"; // Le nombre de velo sera marquer en rouge
            this.autorisation = false; // Interdit la réservation
        } else if(this.etat === "OPEN") { // Sinon si la Station est ouverte
            this.etat = "OUVERT"; // Traduction du texte
            document.getElementById("etatStation").style.color = ""; // Le champ retrouve sa couleur d'origine
            this.autorisation = true; // Autorise la réservation
            if(this.nbVelo === 0) {
                document.getElementById("veloDispo").style.color = "red"; // Le champs sera marquer en rouge
                this.autorisation = false; // Interdit la réservation
            } else if(this.nbVelo > 0) {
                document.getElementById("veloDispo").style.color = ""; // Le champ retrouve sa couleur d'origine
            }
        }
    }
};

// Appel de la méthode Ajax et récuperation de la liste des stations
station.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=paris&apiKey=8d964b828792e1a92da605f34933f01cc0f27098", function(reponse) {
    listeStations = JSON.parse(reponse);

    // Parcour les données des stations
    listeStations.forEach(function(reponseInfoStation) {

        // Appel de la méthode d'attribution d'une icone de marqueur
        maps.iconMarqueur(reponseInfoStation.status);

        // Appel de la méthode initMarqueur pour positionner les marqueurs sur la carte
       maps.initMarqueur(reponseInfoStation.position);

        // Ajoute un évenement lors du clic sur les marqueurs
        google.maps.event.addListener(marqueur, "click", function() {

            // On cache les différentes partie de la page
            document.getElementById("messageErreur").style.display = "none"; // Les message d'erreur
            document.getElementById("containerCanvas").style.display = "none"; // Le canvas

            // Apparition du bloc contenant les infos de la station selectionner
            document.getElementById("infoStation").style.display = "block";

            // Insertion des données dans l'objet "station"
            station.traitementDonneesStation(reponseInfoStation);

            // Verification de l'autorisation de reservation
            station.autorisationReservation();

            // Insertion des données dans le bloc
            station.insertionDonneesStation();
        });
    });

    // Evenements pour le clic sur le bouton de reservation
    document.getElementById("bouttonReservation").querySelector("button").addEventListener("click", function(){
        if(station.autorisation) { // Si l'autorisation de reserver est à true
            document.getElementById("containerCanvas").style.display = "block"; // Le canvas apparait
            document.getElementById("containerCanvas").querySelector("strong").innerHTML = station.nom; // Insertion du nom de la station
            window.scrollTo(0,900); // On fait remonter la page pour voir apparaitre le canvas
        } else { // Si l'autorisation est à false
            document.getElementById("messageErreur").style.display = "block"; // On fait apparaitre le message d'erreur
            setTimeout(function() {
                document.getElementById("messageErreur").style.display = "none"; // Le message d'erreur disparait au bout de 5 secondes
            },5000);
        }
    });

    // Appel de la méthode "marker Clusterer"
    maps.regroupementMarqueurs();
});
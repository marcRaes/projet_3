// Objet compteur  ==>  Le compte à rebour
var compteur = {
    minutes : 20, // Minutes du compte à rebour
    secondes : 00, // Secondes du compte à rebour
    minutesElt : null, // Elément minutes (celui qui sera inserer dans le HTML)
    secondesElt : null, // Elément secondes (celui qui sera inserer dans le HTML)
    nomStation : null, // Nom de la station de réservation
    compteARebour : null, // Attribut du compte à rebour
    compteARebourTerminer : null, // Attribut du compte à rebour terminer
    annulationReservation : false, // Message de confirmation d'annulation de la reservation

    // Méthode lancement d'une réservation
    lancementReservation : function() {
        // Mis en place des session storage
        sessionStorage.setItem("minutes", this.minutes);
        sessionStorage.setItem("secondes", this.secondes);
        sessionStorage.setItem("nomStation", station.nom);

        // Enregistre la session storage du nom de la station dans son attribut
        this.nomStation = sessionStorage.getItem("nomStation");

        // On re-cache les différentes partie de la page sauf la section de location
        document.getElementById("infoStation").style.display = "none"; // Le cadre d'info sur les stations
        document.getElementById("containerCanvas").style.display = "none"; // Le canvas
        document.getElementById("sectionLocation").style.display = "block"; // La section de location

        // Affichage et disparition du message de confirmation
        document.getElementById("messageConfirmationLocation").style.display = "block";
        setTimeout(function() {
            document.getElementById("messageConfirmationLocation").style.display = "none";
        }, 3000);

        // Insert le nom de la station
        document.getElementById("messageLocation").querySelector("strong").innerHTML = this.nomStation;

        // Lancement du compte à rebour
        this.compteARebour = setInterval("compteur.initCompteur()", 1000);
    },

    // Méthode ré-initialisation du compteur
    initCompteur : function() {
        if(this.minutes < 10) { // Si il reste moins de 10 minutes
            this.minutesElt = "0" + this.minutes; // Ajoute un 0 devant les minutes
        } else {
            this.minutesElt = this.minutes; // Sinon les minutes s'affichent normalement
        }
        
        if(this.secondes < 10) { // Si il reste moins de 10 secondes
            this.secondesElt = "0" + this.secondes; // Ajoute un 0 devant les secondes
        } else {
            this.secondesElt = this.secondes; // Sinon les secondes s'affichent normalement
        }
        document.getElementById("compteur").innerHTML = this.minutesElt + " : " + this.secondesElt; // Ajout du compte à rebour dans le HTML

        this.compteurStart();
    },

    // Méthode de fonctionnement du compteur
    compteurStart : function() {
        if((this.minutes >= 0) && (this.secondes > 0)) { // Si secondes est supérieur à 0
            this.secondes--;
            sessionStorage.setItem("secondes", this.secondes); // Modification de la session storage
        } else if((this.minutes > 0) && (this.secondes <= 0)) { // Sinon si les minutes sont superieur à 0 et les secondes inferieur ou égale à 0
            this.secondes = 59; // On replace les secondes à 59
            this.minutes--; // On diminue les minutes
            // Modification des session storage
            sessionStorage.setItem("minutes", this.minutes);
            sessionStorage.setItem("secondes", this.secondes);
        } else if((this.minutes == 0) && (this.secondes == 0)) { // Sinon si les minutes et les secondes sont égale à 0 (compte a rebour terminer)
            // Affichage du message de fin de location
            document.getElementById("messageFinLocation").style.display = "block";

            // Cache le message de location
            document.getElementById("messageLocation").style.display = "none";

            // Appel de la méthode "reservationTerminer"
            this.compteARebourTerminer = setTimeout("compteur.reservationTerminer()", 4000);
        }
    },

    // Méthode appeler à la fin de la réservation
    reservationTerminer : function() {
        // Arrêt du compte à rebour
        clearInterval(this.compteARebour);

        // Reset des attributs du compte à rebour
        this.minutes = 20;
        this.secondes = 00;
        this.minutesElt = null;
        this.secondesElt = null;

        // Suppression de la session storage
        sessionStorage.clear();

        // Arrêt de l'appel à la méthode
        clearTimeout(this.compteARebourTerminer);

        // Remet en place l'affichage par defaut des blocs
        document.getElementById("sectionLocation").style.display = "none";
        document.getElementById("messageFinLocation").style.display = "none";
        document.getElementById("messageLocation").style.display = "block";
    },

    annulationReservation : function() {
        document.getElementById("annulationReservation").style.display = "block";
        setTimeout(function() {
            document.getElementById("annulationReservation").style.display = "none";
        }, 3000);

        this.reservationTerminer();
    },

    // Méthode qui vérifie si une réservation est en cours au lancement de la page et lors du rafraichissement
    verificationSessionStorage : function() {
        if (sessionStorage.getItem("minutes")) { // Si une reservation est en cours
            // Récuperation et stockage des session storage dans les attributs
            this.minutes = sessionStorage.getItem("minutes"); // Minutes
            this.secondes = sessionStorage.getItem("secondes"); // Secondes
            this.nomStation = sessionStorage.getItem("nomStation"); // Nom de la station de réservation

            // Relance le compteur
            this.compteARebour = setInterval("compteur.initCompteur()", 1000);

            // Insert le nom de la station
            document.getElementById("messageLocation").querySelector("strong").innerHTML = compteur.nomStation;
            document.getElementById("sectionLocation").style.display = "block";
        } else { // Si aucune reservation est en cours
            // Fait disparaitre le cadre de réservation
            document.getElementById("sectionLocation").style.display = "none";
        }
    },

    // Méthode qui annule la réservation en cours
    resetReservation : function() {
        if(this.nomStation != station.nom) {
            this.annulationReservation = window.confirm("Cette nouvelle réservation annulera la réservation sur la station : " + this.nomStation +
            "\net enregistrera une nouvelle réservation sur la station " + station.nom);
        } else {
            this.annulationReservation = window.confirm("Cette nouvelle réservation remplacera la réservation déja existante sur la station : \n" + this.nomStation);
        }
        if (this.annulationReservation) {
            // Suppression de la session storage
            sessionStorage.clear();

            // Arrêt du decompte
            clearInterval(this.compteARebour);

            // Reset des attributs du compte à rebour
            this.minutes = 20;
            this.secondes = 00;
            this.minutesElt = null;
            this.secondesElt = null;

            // Lance la méthode de lancement de la reservation
            this.lancementReservation();
        }
    }
}

// Vérification de l'existence d'une réservation
compteur.verificationSessionStorage();

// Evenements lors de la validation du Canvas
document.getElementById("bouttonValider").addEventListener("click", function() {
    localStorage.setItem("signature", signature.canvas.toDataURL());
    signature.clearCanvas(); // Efface le CANVAS
    
    // Vérification d'une réservation existante
    if(sessionStorage.getItem("minutes")) { // si une reservation existe
        // Suppression de la réservation existante
        compteur.resetReservation();
    } else { // Aucune reservation existe
        // Lance la méthode de lancement de la reservation
        compteur.lancementReservation();
    }
});
// Objet compteur  ==>  Le compte à rebour
var compteur = {
    minutes : 20,
    secondes : 00,
    minutesElt : null,
    secondesElt : null,
    nomStation : null,
    reservationExiste : false,
    annulationReservation : false,

    // Méthode lancement d'une réservation
    lancementReservation : function() {
        // Mis en place des session storage
        sessionStorage.setItem("reservation", signature.canvas);
        sessionStorage.setItem("minutes", this.minutes);
        sessionStorage.setItem("secondes", this.secondes);
        sessionStorage.setItem("nomStation", station.nom);
        // Enregistre la session storage du nom de la station dans son attribut
        this.nomStation = sessionStorage.getItem("nomStation");
        // Lancement du compte à rebour
        decompte = setInterval("compteur.initCompteur()", 1000);
        // On re-cache les différentes partie de la page sauf la section de location
        document.getElementById("infoStation").style.display = "none"; // Le cadre d'info sur les stations
        document.getElementById("containerCanvas").style.display = "none"; // Le canvas
        document.getElementById("sectionLocation").style.display = "block"; // La section de location

        // Insert le nom de la station
        document.getElementById("messageLocation").querySelector("strong").innerHTML = compteur.nomStation;
    },

    // Méthode ré-initialisation du compteur
    initCompteur : function() {
        this.reservationExiste = true;
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
            document.getElementById("messageLocation").innerHTML = "Votre réservation à expirer !"; // Mis en place d'un  message dans le code HTML
            this.decompteTerminer = setTimeout(this.reservationTerminer, 6000); // Appel de la méthode "reservationTerminer"
        }
    },

    // Méthode appeler à la fin de la réservation
    reservationTerminer : function() {
        // Re-cache la section de location
        document.getElementById("sectionLocation").style.display = "none";
        // Arrêt du decompte
        clearInterval(decompte);
        // Suppression de la session storage
        sessionStorage.clear();
        // Arrêt de l'appel à la méthode
        clearTimeout(decompteTerminer);
    },

    // Méthode qui vérifie si une réservation est en cours au lancement de la page et lors du rafraichissement
    verificationSessionStorage : function() {
        if (sessionStorage.getItem("reservation")) { // Si une reservation est en cours
            // Récuperation et stockage des session storage dans les attributs
            this.minutes = sessionStorage.getItem("minutes"); // Minutes
            this.secondes = sessionStorage.getItem("secondes"); // Secondes
            this.nomStation = sessionStorage.getItem("nomStation"); // Nom de la station de réservation
            // Relance le compteur
            decompte = setInterval("compteur.initCompteur()", 1000);
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
            this.reservationExiste = false;
            // Suppression de la session storage
            sessionStorage.clear();
            // Arrêt du decompte
            clearInterval(decompte);
            // Replace le compteur à 20 minutes
            this.minutes = 20;
            this.secondes = 00;

            // Lance la méthode de lancement de la reservation
            this.lancementReservation();
        }
    }
}

// Vérification de l'existence d'une réservation
compteur.verificationSessionStorage();
// Evenement lors de la validation du Canvas
document.getElementById("bouttonValider").addEventListener("click", function() {
    signature.clearCanvas(); // Efface le CANVAS
    // Vérification d'une réservation existante
    if(compteur.reservationExiste) { // si une reservation existe
        // Suppression de la réservation existante
        compteur.resetReservation();
    } else { // Aucune reservation existe
        // Lance la méthode de lancement de la reservation
        compteur.lancementReservation();
    }
});
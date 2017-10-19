var compteur = {
    // Attributs
    minutes : 00, // Minutes du compte à rebour
    secondes : 20, // Secondes du compte à rebour
    minutesElt : null, // Elément minutes (celui qui sera inserer dans le HTML)
    secondesElt : null, // Elément secondes (celui qui sera inserer dans le HTML)
    nomStation : null, // Nom de la station de réservation
    compteARebour : null, // Attribut du compte à rebour
    compteARebourTerminer : null, // Attribut du compte à rebour terminer
    //reservationExiste : false, // Permet de vérifier l'existence d'une réservation
    annulationReservation : false, // Message de confirmation d'annulation de la reservation
    nbVeloStation : document.getElementById("veloDispo").innerHTML, // Affichage du nombre de velos disponible

    // Méthode lancement d'une réservation
    lancementReservation : function() {
        // Mis en place des session storage
        sessionStorage.setItem("minutes", this.minutes); // Session Storage des minutes
        sessionStorage.setItem("secondes", this.secondes); // Session Storage des secondes
        sessionStorage.setItem("nomStation", station.nom); // Session Storage du nom de la station de reservation
        sessionStorage.setItem("nbVelo", this.nbVeloStation); // Session Storage du nombre de vélo disponible à la station

        // Enregistre la session storage du nom de la station dans son attribut
        this.nomStation = sessionStorage.getItem("nomStation");

        // On re-cache les différentes partie de la page sauf la section de location
        document.getElementById("infoStation").style.display = "none"; // Le cadre d'info sur les stations
        document.getElementById("containerCanvas").style.display = "none"; // Le canvas
        document.getElementById("sectionLocation").style.display = "block"; // La section de location

        // Insert le nom de la station
        document.getElementById("messageLocation").querySelector("strong").innerHTML = this.nomStation;
    },

    // Méthode d'initialisation du compteur
    initCompteur : function() {
        // Permettra de vérifier qu'une réservation à était faite
        //this.reservationExiste = true;

        // Conditions qui ajoute un 0 au minutes et secondes sur le compteur
        if(this.minutes < 10) { // Si il reste moins de 10 minutes
            // Ajoute un 0 devant les minutes
            document.getElementById("minutes").textContent = "0" + this.minutes + ":";
        } else {
            // Sinon les minutes s'affichent normalement
            document.getElementById("minutes").textContent = this.minutes + ":";
        }
                
        if(this.secondes < 10) { // Si il reste moins de 10 secondes
            // Ajoute un 0 devant les secondes
            document.getElementById("secondes").textContent = "0" + this.secondes;
        } else {
            // Sinon les secondes s'affichent normalement
            document.getElementById("secondes").textContent = this.secondes;
        }

        this.compteurStart();
    },

    // Méthode de fonctionnement du compteur
    compteurStart : function() {
        // Le compteur fonctionne grâce aux conditions
        if((this.minutes >= 0) && (this.secondes > 0)) { // Si secondes est supérieur à 0
            this.secondes--;

            // Modification de la session storage
            sessionStorage.setItem("secondes", this.secondes); // Secondes
        } else if((this.minutes > 0) && (this.secondes <= 0)) { // Sinon si les minutes sont superieur à 0 et les secondes inferieur ou égale à 0
            this.secondes = 59; // On replace les secondes à 59
            this.minutes--; // On diminue les minutes

            // Modification des session storage
            sessionStorage.setItem("minutes", this.minutes); // Minutes
            sessionStorage.setItem("secondes", this.secondes); // Secondes
        } else if((this.minutes == 0) && (this.secondes == 0)) { // Sinon si les minutes et les secondes sont égale à 0 (compte a rebour terminer)
            document.getElementById("messageLocation").innerHTML = "Votre réservation à expirer !"; // Mis en place d'un  message dans le code HTML

            // Arrêt du decompte
            clearInterval(this.compteARebour);
            this.compteARebourTerminer = setTimeout(this.reservationTerminer, 4000); // Appel de la méthode "reservationTerminer"
        }
    },

    // Méthode appeler à la fin de la réservation
    reservationTerminer : function() {
        // Arrêt de l'appel à la méthode
        clearTimeout(this.compteARebourTerminer);

        // Replace l'attribut de vérification d'une session à false
        //this.reservationExiste = false;

        // Suppression de la session storage
        sessionStorage.removeItem("minutes");
        sessionStorage.removeItem("secondes");
        sessionStorage.removeItem("nomStation");
        sessionStorage.removeItem("nbVelo");

        // Re-cache la section de location
        document.getElementById("sectionLocation").style.display = "none";
    },

    // Méthode qui vérifie si une réservation est en cours au lancement de la page et lors du rafraichissement
    verificationSessionStorage : function() {
        if (sessionStorage.getItem("nomStation")) { // Si une réservation est en cours
            // Récuperation et stockage des session storage dans les attributs
            this.minutes = sessionStorage.getItem("minutes"); // Minutes
            this.secondes = sessionStorage.getItem("secondes"); // Secondes
            this.nomStation = sessionStorage.getItem("nomStation"); // Nom de la station de réservation
            this.nbVeloStation = sessionStorage.getItem("nbVelo"); // Nombre de vélos disponible à la station

            // Relance le compteur
            this.compteARebour = setInterval(this.initCompteur, 1000);

            // Insert le nom de la station
            document.getElementById("messageLocation").querySelector("strong").innerHTML = this.nomStation;
            document.getElementById("sectionLocation").style.display = "block";
        } else { // Si aucune reservation est en cours
            // Fait disparaitre le cadre de réservation
            document.getElementById("sectionLocation").style.display = "none";
        }
    },
}

// Vérification de l'existence d'une réservation
compteur.verificationSessionStorage();

// Evenement lors de la validation du Canvas
document.getElementById("bouttonValider").addEventListener("click", function() {
    // Enregistrement de la signature dans une localStorage pour insertion dans la page du contrat de location
    localStorage.setItem("signature", signature.canvas.toDataURL());

    // Efface le CANVAS
    signature.clearCanvas();

    // Vérification d'une réservation existante
    if(sessionStorage.getItem("nomStation")) { // si une reservation existe
        // Suppression de la réservation existante
        compteur.resetReservation();
    } else { // Aucune reservation existe
        compteur.lancementReservation(); // Lance la méthode de lancement de la reservation

        // Lancement du compte à rebour
        compteur.compteARebour = setInterval(compteur.initCompteur(), 1000);
    }
});
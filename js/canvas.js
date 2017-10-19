// Objet signature  ==>  Le canvas
var signature = {
    // Attributs
    ecriture : false, // Attribut d'activation de l'écriture
    canvas : document.getElementById("signature"), // Selection du canvas dans le HTML
    context : null, // Définira le contexte d'utilisation du canvas
    signatureImg : null,

    // Méthode qui traduit l'evenement Touch en Event pour ecrans tactile
    convertTouchEvent : function(ev) {
        var touch, ev_type, mouse_ev;
        touch = ev.targetTouches[0];
        ev.preventDefault();
        switch (ev.type) {
            case 'touchstart':
                // S'assure qu'un doigt est sur la cible
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousedown';
                break;
            case 'touchmove':
                // S'assure qu'un doigt est sur la cible
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousemove';
                break;
            case 'touchend':
                // S'assure que le doigt à était enlever de la cible
                if (ev.changedTouches.length != 1) {
                    return;
                }
                touch = ev.changedTouches[0];
                ev_type = 'mouseup';
                break;
            default:
                return;
        }
        
        mouse_ev = document.createEvent("MouseEvents");
        mouse_ev.initMouseEvent(
            ev_type, // Genre de l'événement
            true,
            true,
            window, // Vue de l'événement
            0, // Compte de clic de souris
            touch.screenX, // Coordonnée X de l'écran
            touch.screenY, // Coordonnée Y de l'écran
            touch.clientX, // Coordonnée X du client
            touch.clientY, // Coordonnée Y du client
            ev.ctrlKey, // Vérifie si la touche contrôle a été appuyée
            ev.altKey, // Vérifie si la touche alt a été appuyée
            ev.shiftKey, // Vérifie si la touche majuscule a été appuyée
            ev.metaKey, // Vérifie si la touche meta a été appuyée
            0, // Bouton de la souris
            null // Cible
        );
        this.dispatchEvent(mouse_ev);
    },

    // Méthode qui récupére les coordonées de l'élement de pointage (souris, doigt...)
    getMousePos : function(event) {
        rect = this.canvas.getBoundingClientRect(); // renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage

        return{
            x:event.clientX - rect.left,
            y:event.clientY - rect.top
        };
    },

    // Méthode qui détermine le déplacement de l'élement de pointage
    deplacementSouris : function(event) {
        sourisPosition = this.getMousePos(event); // Coordonnées de l'élement de pointage retourner par la méthode "getMousePos"
        positionX = sourisPosition.x; 
        positionY = sourisPosition.y;
        this.dessin(positionX, positionY);
    },

    // Méthode qui permet de dessiner dans le canvas
    dessin : function(positionX, positionY) {
        this.context = this.canvas.getContext("2d"); // Contexte du canvas
        this.context.lineWidth = 5; // Largeur du tracer

        if(this.ecriture){
            this.context.lineTo(positionX, positionY); // Désigne le point d'arriver du tracer
            this.context.stroke(); // Effectue le tracer
        }
    },

    // Méthode qui permet de désactiver l'écriture
    desactivationDessin : function() {
        this.ecriture = false; // Desactive l'écriture dans le canvas
    },

    // Méthode qui active et débute l'écriture dans le canvas
    activationDessin : function() {
        this.ecriture = true; // Active l'écriture sur le canvas
        this.context.beginPath(); // Commence un nouveau chemin de dessin
        this.context.moveTo(positionX, positionY); // Designe le début du tracer
    },

    // Méthode qui permet d'éffacer le canvas
    clearCanvas : function() {
        this.context.clearRect(0, 0, 800, 200); // Reinitialise le canvas
    }
}

// Appel des méthodes sur ecrans tactiles
signature.canvas.addEventListener("touchstart", signature.convertTouchEvent);
signature.canvas.addEventListener("touchmove", signature.convertTouchEvent);
signature.canvas.addEventListener("touchend", signature.convertTouchEvent);

// Appel des méthodes sur PC
signature.canvas.addEventListener("mousedown", signature.activationDessin.bind(signature));
signature.canvas.addEventListener("mousemove", signature.deplacementSouris.bind(signature));
signature.canvas.addEventListener("mouseup", signature.desactivationDessin.bind(signature));

// Appel de la méthode d'effacement du canvas lors de l'appui sur le bouton "effacer"
document.getElementById("bouttonEffacer").addEventListener("click", function() {
    signature.clearCanvas();
});
// Objet signature  ==>  Le canvas
var signature = {
    // Attributs
    ecriture : false,
    canvas : document.getElementById("signature"),
    context : null,

    // Méthode qui traduit l'evenement Touch en Event pour ecrans tactile
    convertTouchEvent : function(ev) {
        var touch, ev_type, mouse_ev;
        touch = ev.targetTouches[0];
        ev.preventDefault();
        switch (ev.type) {
            case 'touchstart':
                // Make sure only one finger is on the target
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousedown';
                break;
            case 'touchmove':
                // Make sure only one finger is on the target
                if (ev.targetTouches.length != 1) {
                    return;
                }
                touch = ev.targetTouches[0];
                ev_type = 'mousemove';
                break;
            case 'touchend':
                // Make sure only one finger is lifted from the target
                // TODO AND CHECK: check that targetTouches is empty?
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
            ev_type, /* type of event */
            true, /* can bubble? */
            true, /* cancelable? */
            window, /* event view */
            0, /* mouse click count */
            touch.screenX, /* event's screen x-coordinate */
            touch.screenY, /* event's screen y-coordinate */
            touch.clientX, /* event's client x-coordinate */
            touch.clientY, /* event's client y-coordinate */
            ev.ctrlKey, /* control key was pressed? */
            ev.altKey, /* alt key was pressed? */
            ev.shiftKey, /* shift key was pressed? */
            ev.metaKey, /* meta key was pressed? */
            0, /* mouse button */
            null /* related target */
        );
        this.dispatchEvent(mouse_ev);
    },

    getMousePos : function(event) {
        rect = this.canvas.getBoundingClientRect(); // renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage
        return{
            x:event.clientX - rect.left,
            y:event.clientY - rect.top
        };
    },

    deplacementSouris : function(event) {
        sourisPosition = this.getMousePos(event); // Coordonnées de la souris retourner par la méthode "getMousePos"
        positionX = sourisPosition.x; 
        positionY = sourisPosition.y;
        this.dessin(positionX, positionY);
    },

    dessin : function(positionX, positionY) {
        this.context = this.canvas.getContext("2d"); // Contexte du canvas
        this.context.lineWidth = 5; // Largeur du tracer

        if(this.ecriture){
            this.context.lineTo(positionX, positionY); // Désigne le point d'arriver du tracer
            this.context.stroke(); // Effectue le tracer
        }
    },

    desactivationDessin : function() {
        this.ecriture = false; // Desactive l'écriture sur le canvas
    },

    activationDessin : function() {
        this.ecriture = true; // Active l'écriture sur le canvas
        this.context.beginPath(); // Commence un nouveau chemin de dessin
        this.context.moveTo(positionX, positionY); // Designe le début du tracer
    },

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

document.getElementById("bouttonEffacer").addEventListener("click", function() {
    signature.clearCanvas();
});
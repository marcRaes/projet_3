var diaporama = {
    items : document.getElementsByClassName("item"),
    i : 0,

    // Méthode qui récupére les touches du clavier et actionne le diaporama en fonction de la touche
    infosClavier : function(e) {
        if(e.keyCode === 39) {
            document.addEventListener("keydown", this.suivant()); // Appui sur la touche =>
        } else if(e.keyCode === 37) {
            document.addEventListener("keydown", this.precedent()); // Appui sur la touche <=
        }
    },

    // Méthode qui fait fonctionner le diaporama en avant
    suivant : function() {
        this.items[this.i].style.opacity = "0"; // Fait disparaître l'image active
        if(this.i === 4) { // Si le diaporama est à la dernière image
            this.i = 0; // On repasse l'attribut à 0 pour faire réapparaître la première image
        } else { // Sinon on passe à l'image suivante
            this.i++; // En augmentant de 1 l'attribut
        }
        this.items[this.i].style.opacity = "1"; // Fait apparaître l'image suivante
    },

    // Méthode qui fait fonctionner le diaporama en arrière
    precedent : function() {
        this.items[this.i].style.opacity = "0"; // Fait disparaître l'image active
        if(this.i === 0) { // Si le diaporama est à la premiére image
            this.i = 4; // On passe l'attribut à 4 pour faire réapparaître l'image précedente
        } else { // Sinon on passe à l'image precedente
            this.i--; // En diminuant de 1 la valeur de l'attribut
        }
        this.items[this.i].style.opacity = "1"; // Fait apparaître l'image précedente
    }
}

// Le boutton droit appel la méthode "suivant"
document.getElementById("bouttonDroit").addEventListener("click", diaporama.suivant.bind(diaporama));

// Le boutton gauche appel la méthode "precedent"
document.getElementById("bouttonGauche").addEventListener("click", diaporama.precedent.bind(diaporama));

// Gestion de l'appui et du relâchement d'une touche du clavier
document.addEventListener("keydown", diaporama.infosClavier.bind(diaporama));
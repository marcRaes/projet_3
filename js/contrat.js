/* ----------------------------------------------------------- */
/* --   Fichier pour les élements du contrat de location    -- */
/* ----------------------------------------------------------- */

// Objet contrat
var contrat = {
    // Attributs
    width : null,
    height : null,
    top : null,
    left : null,

    // Méthode d'ouverture du contrat dans une nouvelle fenêtre
    ouvertureContrat : function() {

        // Dimensions de la fenêtre du contrat de location
        this.width = 1000;
        this.height = 800;
            
        this.top = (screen.height - this.height)/2;
        this.left = (screen.width - this.width)/2;

        window.open (
            'contrat.html',
            'contrat_de_location',
            'menubar=no, scrollbars=no, top=' + this.top + ', left=' + this.left + ', width=' + this.width + ', height=' + this.height
        );
    },

    // Méthode pour insérer la signature dans la balise image du contrat de location
    affichageSignature : function() {
        document.getElementById("imgSignature").setAttribute("src", localStorage.getItem("signature"));
    }
}

// Evénement lors du clique sur le bouton du contrat de location
document.getElementById("contratLocation").addEventListener("click", function() {
    // Lance la méthode d'ouverture du contrat
    contrat.ouvertureContrat();
});
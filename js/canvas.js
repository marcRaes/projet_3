var canvas = document.getElementById("signature");
var contextCanvas = canvas.getContext("2d");

function getBoutonSouris(code) {
    if(code == 0) {
        return bouton = "gauche";
    }
}

function infosSouris(e) {
    console.log("Evènement souris : " + e.type + ", bouton " +
        getBoutonSouris(e.button) + ", X : " + e.clientX + ", Y : " + e.clientY);
}

canvas.addEventListener("click", infosSouris);
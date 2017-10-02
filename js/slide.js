var items, length, deg, z, move = 0; // Déclaration des variables

function rotate(direction) {
    move += direction;

    for(var i = 0; i < length; i++) {
        items[i].style.transform = "rotateY(" + (deg * (i+move)) + "deg) translateZ(" + z + "px)";
    }
}

function load() {
    items = document.getElementsByClassName("item");
    length = items.length; // Nombre d'élements present dans le diaporama

    deg = 360 / length; // Calcule à combien de degré devra tourner le diaporama
    // Calcule de trygonométrie 
    //moitié de la longueur des faces / tangente(deg)
    // (Math.PI / 180) ce calcule sert à obtenir le résultat voulu en degré puisque JavaScript fonctionne en radien
    z = (items[0].offsetWidth / 2) / Math.tan((deg / 2) * (Math.PI / 180));

    for(var i = 0; i < length; i++) {
        items[i].style.transform = "rotateY(" + (deg * i) + "deg) translateZ(" + z + "px)";
    }
}

window.addEventListener('load', load);

// Affiche des informations sur un événement clavier
function infosClavier(e) {
    if(e.keyCode === 39) {
        document.addEventListener("keydown", rotate(-1));
    } else if(e.keyCode === 37) {
        document.addEventListener("keydown", rotate(1));
    }
}

// Gestion de l'appui et du relâchement d'une touche du clavier
document.addEventListener("keydown", infosClavier);
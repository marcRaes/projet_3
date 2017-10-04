if (sessionStorage.getItem("reservation")) { // Si une reservation est en cours
    document.getElementById("sectionLocation").style.display = "block";
} else { // Si aucune reservation est en cours
    // Fait disparaitre le cadre de réservation
    document.getElementById("sectionLocation").style.display = "none";
}

// Définition des variables
var decompte, decompteTerminer, reservationSecondes, reservationMinutes, secondes, minutes, reservation;

function reservationTerminer() {
    clearInterval(decompte);
    clearTimeout(decompteTerminer);
    sessionStorage.clear();
    document.getElementById("sectionLocation").style.display = "none";
}

function reservationTime() {
        // On selectionne les secondes et les minutes du fichier HTML
        reservationSecondes = document.getElementById("secondes");
        reservationMinutes = document.getElementById("minutes");
        // Variables secondes et minutes
        secondes = Number(reservationSecondes.textContent);
        minutes = Number(reservationMinutes.textContent);

    if((minutes >= 0) && (secondes > 0)) {
        reservationSecondes.textContent = secondes - 1;
    } else if((minutes > 0) && (secondes <= 0)) {
        secondes = document.getElementById("secondes").textContent = 59;
        reservationMinutes.textContent = minutes - 1;
    } else {
        document.getElementById("messageLocation").innerHTML = "Votre réservation à expirer";
        decompteTerminer = setTimeout(reservationTerminer, 6000);
    }
}

var checked = document.getElementById("bouttonValider").addEventListener("click", function(){
    context.clearRect(0, 0, 800, 200);
    // Session Storage de réservation
    sessionStorage.setItem("reservation", canvas);
    decompte = setInterval(reservationTime, 1000);
    document.getElementById("infoStation").style.display = "none";
    document.getElementById("containerCanvas").style.display = "none";
    document.getElementById("sectionLocation").style.display = "block";
});
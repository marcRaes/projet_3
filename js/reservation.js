if (sessionStorage.getItem("reservation")) { // Si une reservation est en cours
    var secondes = sessionStorage.getItem("secondes");
    var minutes = sessionStorage.getItem("minutes");
    setInterval(reservationTime, 1000);
    document.getElementById("sectionLocation").style.display = "block";
    document.getElementById("messageLocation").querySelector("strong").innerHTML = sessionStorage.getItem("nomStation");
} else { // Si aucune reservation est en cours
    var minutes = 19;
    var secondes = 59;
    // Fait disparaitre le cadre de réservation
    document.getElementById("sectionLocation").style.display = "none";
}

// Définition des variables
//var decompte, decompteTerminer, reservationSecondes, reservationMinutes, secondes, minutes, reservation;

document.getElementById("compteur").innerHTML = "<strong>" + minutes + " minutes et " + secondes + " secondes</strong>";

function reservationTerminer() {
    document.getElementById("sectionLocation").style.display = "none";
    clearInterval(decompte);
    sessionStorage.clear();
    clearTimeout(decompteTerminer);
}

function reservationTime() {
    if((minutes >= 0) && (secondes > 0)) {
        secondes--;
        sessionStorage.setItem("minutes", minutes);
        sessionStorage.setItem("secondes", secondes);
        document.getElementById("compteur").innerHTML = "<strong>" + minutes + " minutes et " + secondes + " secondes</strong>";
    } else if((minutes > 0) && (secondes <= 0)) {
        secondes = 59;
        minutes--;
        sessionStorage.setItem("minutes", minutes);
        sessionStorage.setItem("secondes", secondes);
        document.getElementById("compteur").innerHTML = "<strong>" + minutes + " minutes et " + secondes + " secondes</strong>";
    } else if((minutes == 0) && (secondes == 0)) {
        decompteTerminer = setTimeout(reservationTerminer, 6000);
        document.getElementById("messageLocation").innerHTML = "Votre réservation à expirer !";
    }
}

var checked = document.getElementById("bouttonValider").addEventListener("click", function(){
    context.clearRect(0, 0, 800, 200);
    // Session Storage de réservation
    sessionStorage.setItem("reservation", canvas);
    sessionStorage.setItem("nomStation", document.getElementById("messageLocation").querySelector("strong").innerHTML);
    decompte = setInterval(reservationTime, 1000);
    document.getElementById("infoStation").style.display = "none";
    document.getElementById("containerCanvas").style.display = "none";
    document.getElementById("sectionLocation").style.display = "block";
});
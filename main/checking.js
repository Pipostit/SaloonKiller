/**
  * Fonction de vérification côté client, qui vérifie si les paramètres actuels
  * sont corrects.
  * A appeler avant de lancer une partie.
  **/
function checkSettings(settings) {

    if (settings['loupgarou']<0) {
        alert("Nombre de loup garou négatif...");
        return false;
    }

    if (settings['villageois']<0) {
        alert("Nombre de villageois négatif...");
        return false;
    }

    if(settings['chasseur']>1||settings['chasseur']<0){
        alert("trop de chasseur");
        return false;
    }

    if(settings['cupidon']>1||settings['cupidon']<0){
        alert("trop de cupidon");
        return false;
    }

    if(settings['petitefille']>1||settings['petitefille']<0){
        alert("trop de petite fille");
        return false;
    }

    if(settings['sorciere']>1||settings['sorciere']<0){
        alert("trop de sorciere");
        return false;
    }

    if(settings['voleur']>1||settings['voleur']<0){
        alert("trop de voleur");
        return false;
    }

    if(settings['voyante']>1||settings['voyante']<0){
        alert("trop de voyante");
        return false;
    }

    /*
    // vérification faite avec le compteur de cartes, dans main.js

    if(nbVoy-2*nbVol+nbSor+nbLg+nbVil+nbPf+nbCha+nbCup!=sockets.length){
        alert("Mauvaise configuration: Le nombre de carte ne convient pas au nombre de joueurs.")
        return false;
    }*/


    return true;

}

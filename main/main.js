var port = 8081;
var socket = io.connect('http://localhost:' + port);
socket.emit('Admin', 'admin');
  //document.getElementById("pseudo").value);

var idServ;
var bJoin;
var bCreate;

var nbLoup = document.getElementById('nbLoup');
var nbVil = document.getElementById('nbVil');
var cbCupidon = document.getElementById('cupidonBox');
var cbChasseur = document.getElementById('chasseurBox');
var cbVoyante = document.getElementById('voyanteBox');
var cbVoleur = document.getElementById('voleurBox');
var cbPetiteFille = document.getElementById('petiteFilleBox');
var cbSorciere = document.getElementById('sorciereBox');

var rangeBoxLg;
var rangeBoxVil;

var bJoin = document.getElementById('join');
var bCreate = document.getElementById('create');
let playersCount = document.getElementById('connectedPlayersCount');
let settingsWindow = document.getElementById('settings');
let title = document.getElementById('pageTitle');
let intro = document.getElementById('intro');

cbCupidon.onchange = function(){
  cbCupidon.value = this.checked ? 1 : 0;
  updatePlayerCount();
};
cbChasseur.onchange = function(){
  cbChasseur.value = this.checked ? 1 : 0;
  updatePlayerCount();
};
cbVoyante.onchange = function(){
  cbVoyante.value = this.checked ? 1 : 0;
  updatePlayerCount();
};
cbVoleur.onchange = function(){
  cbVoleur.value = this.checked ? 2 : 0;
  updatePlayerCount();
};
cbPetiteFille.onchange = function(){
  cbPetiteFille.value = this.checked ? 1 : 0;
  updatePlayerCount();
};
cbSorciere.onchange = function(){
  cbSorciere.value = this.checked ? 1 : 0;
  updatePlayerCount();
};

document.getElementById('nbLoup').onchange = function(){

  document.getElementById('rangeBoxLg').innerHTML  = 0;
  updatePlayerCount()

} ;

document.getElementById('nbVil').onchange = function(){
  document.getElementById('rangeBoxVil').innerHTML  = parseInt(nbVil.value);
  updatePlayerCount()
} ;

function updatePlayerCount(){
  var n = 0;
  var i;
  inputs = document.getElementsByTagName("li input");
  for(i=0;i<inputs.length; i++)
    n+=parseInt(inputs.elements[i].value);
  document.getElementById('nbJoueur').innerHTML = parseInt(nbLoup.value)+parseInt(nbVil.value);

}
/*
bJoin.onclick = function(){
  idServ = document.getElementById("saloon").value;
  var startSetting = {};
  socket.emit('serverSettings', startSetting);
};*/

bCreate.onclick = function(){

    // création de l'objet paramètres
    let settings = {
        "chasseur": undefined,
        "cupidon": undefined,
        "loupgarou": document.getElementById("nbLoup").value,
        "petitefille": undefined,
        "sorciere": undefined,
        "villageois": document.getElementById("nbVil").value,
        "voleur": undefined,
        "voyante": undefined
    };

    if(!checkSettings(settings))
        return ;

    if(playersCount.innerText == document.getElementById('nbJoueur').innerText &&
        playersCount.innerText !== '0') {
        /* create(idServ,playerName)*/
        socket.emit('launchGame', settings);
        settingsWindow.style.display = 'none';
        title.innerText = 'Partie lancée !';
        intro.style.display = 'none';
    }
    else if(playersCount.innerText === '0')
        alert('Impossible de lancer une partie avec aucun joueur !');
    else
        alert('Il n\'y a pas autant de cartes que de joueurs connectés !');
};

socket.on('updatePlayers', (players) => {
    updateConnectedPlayers(players);
});
function updateConnectedPlayers(players) {
    document.getElementById('connectedPlayers').innerText = players;
    playersCount.innerText = players.length;
}

function startWaitingForPlayers() {
    socket.emit('saloonReady');
}

socket.on('disconnect', (reason) => {
    console.log('Perte de connexion avec le serveur : ' + reason);
    socket.close();
    closeSaloon();
});

function closeSaloon() {
    document.location.href="main.html";
}


/*
Sur l'accueil:

Soit host, soit joueur. Dans tous les cas, un pseudo est éxigé
En cas de host, un nouveau menu s'affiche avec les options.

saisie du nom;
prise en compte des paramètres;
Etablissement de la liaison avec le serveur;


Attente des joueurs:
Affiche un écran intermédiaire tant que le
salon n'est pas remplis

Début de la partie:

assignation des rôles par le serveur.
Nuit,

Affiche le message du serveur,
les variables d'état des joueurs sont modifié a la fin du tour,
tour suivant,

Application des effets de la nuit,
fin de la nuit.

Jour,
les joueurs débattent a vive voix, un décompte est lancé pour la prise
en compte des votes des joueurs (ils peuvent voter avant, mais le résultat n'est pris en compte qu'au bout du décompte)
*/

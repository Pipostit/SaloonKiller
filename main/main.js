var port = 8081;
var socket = io.connect('http://localhost:' + port);
socket.emit('Admin', 'admin');
  //document.getElementById("pseudo").value);

var idServ;
var bJoin;
var bCreate;
var nbLoup = document.getElementById('nbLoup');
var nbVil = document.getElementById('nbVil');
var rangeBoxLg;
var rangeBoxVil;
var bJoin = document.getElementById('join');
var bCreate = document.getElementById('create');

document.getElementById('nbLoup').onchange = function(){
  document.getElementById('rangeBoxLg').innerHTML  = parseInt(nbLoup.value);
  document.getElementById('nbJoueur').innerHTML = parseInt(nbLoup.value)+parseInt(nbVil.value);
} ;

document.getElementById('nbVil').onchange = function(){
  document.getElementById('rangeBoxVil').innerHTML  = parseInt(nbVil.value);
  document.getElementById('nbJoueur').innerHTML = parseInt(nbLoup.value)+parseInt(nbVil.value);
} ;

/*
bJoin.onclick = function(){
  idServ = document.getElementById("saloon").value;
  var startSetting = {};
  socket.emit('serverSettings', startSetting);
};*/

bCreate.onclick = function(){
  nbLoup = document.getElementById("nbLoup").value;
  nbVil = document.getElementById("nbVil").value;
  /* create(idServ,playerName)*/
  socket.emit('launchGame');
};

socket.on('updatePlayers', (players) => {
    updateConnectedPlayers(players);
});
function updateConnectedPlayers(players) {
    document.getElementById('connectedPlayers').innerText = players;
}

function startWaitingForPlayers() {
    socket.emit('saloonReady');
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

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
  cbVoleur.value = this.checked ? 1 : 0;
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
  document.getElementById('rangeBoxLg').innerHTML  = parseInt(nbLoup.value);
  updatePlayerCount()
} ;

document.getElementById('nbVil').onchange = function(){
  document.getElementById('rangeBoxVil').innerHTML  = parseInt(nbVil.value);
  updatePlayerCount()
} ;

function updatePlayerCount(){
  var n = 0;
  var i;
  var inputs = document.getElementsByTagName("input");
  for(i=0;i<inputs.length; i++){
    n= n+ parseInt(inputs.item(i).value);
  }
  document.getElementById('nbJoueur').innerHTML = n;
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
        "chasseur": cbChasseur.value,
        "cupidon": cbCupidon.value,
        "loupgarou": document.getElementById("nbLoup").value,
        "petitefille": cbPetiteFille.value,
        "sorciere": cbSorciere.value,
        "villageois": document.getElementById("nbVil").value,
        "voleur": cbVoleur.value,
        "voyante": cbVoyante.value
    };

    if(!checkSettings(settings))
        return ;

    if(parseInt(playersCount.innerText) + 2*parseInt(cbVoleur.value) == parseInt(document.getElementById('nbJoueur').innerText) &&
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
        alert('Il n\'y a pas assez de cartes pour les joueurs connectés !');
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

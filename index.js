var http = require('http');
var fs = require('fs');
var path = require('path');
var gameEngine = require('./assets/server/js/gameEngine');

let clientPort = 8080;
let serverPort = 8081;

// Array contenant les sockets s'étant connectés au serveur
let sockets = [];

// -----------------------------------------------------------------------------
// Serveur principal
// -----------------------------------------------------------------------------

var indexServer = http.createServer(function(req, res) {
    let filename = req.url;
    if(filename === '/')
        filename = '/main.html';

    fs.readFile('./main' + filename, 'utf-8', function(error, content) {
        let extension = path.extname(filename);
        if(extension === '.js')
            res.writeHead(200, {"Content-Type": "application/js"});
        else
            res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
indexServer.listen(serverPort);

var ioadmin = require('socket.io').listen(indexServer);
ioadmin.sockets.on('connection', function (socket) {
    // Mettre tes signaux ici
});


// -----------------------------------------------------------------------------
// Client
// -----------------------------------------------------------------------------

// Chargement du fichier index.html affiché au client
var clientServer = http.createServer(function(req, res) {
    let filename = req.url;

    if(filename === '/')
        filename = '/index.html';
    let type = {"Content-Type": "text/html"};

    fs.readFile('./client' + filename, 'utf-8', function(error, content) {

        let extension = path.extname(filename);
        switch(extension) {
            case '.css':
                type = {"Content-Type": "text/css"};
                break;
            case '.js':
                type = {"Content-Type": "application/js"};
                break;
            case '.jpg':
                var img = fs.readFileSync('./client' + filename);
                res.writeHead(200, {"Content-Type": "image/jpeg"});
                res.end(img, 'binary');
                return;
            case '.png':
                var img = fs.readFileSync('./client' + filename);
                res.writeHead(200, {"Content-Type": "image/png"});
                res.end(img, 'binary');
                return;
            default:
                break;
        }

        res.writeHead(200, type);
        res.end(content);
    });
});

var io = require('socket.io').listen(clientServer);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    // Fonction callback, qui initialise tous les listeners avec les clients

    // Envoie un message à tous les clients connectés
	// socket.broadcast.emit('message', 'Un autre joueur vient de se connecter !');

    // Envoie un message via le socket courant
    // socket.emit('message', 'yo test');

    // Mettre des informations en mémoire concernant le socket courant



    socket.on('admin', function(pseudo) {

        if(isPseudoAlreadyUsed(pseudo)) {
            socket.emit('pseudoAlreadyUsed');
            return;
        }
        socket.pseudo = pseudo;
        socket.isAdmin() = function(){return true;};
        console.log(pseudo + ' a rejoint la partie en tant qu\'admi !');
        sockets.push(socket);
        // Confirmation au client qu'il est connecté au serveur
        socket.emit('adminJoined');
    });


    socket.on('newPlayer', function(pseudo) {
        if(isPseudoAlreadyUsed(pseudo)) {
            socket.emit('pseudoAlreadyUsed');
            return;
        }
        socket.pseudo = pseudo;
          socket.isAdmin() = function(){return false;};

        console.log(pseudo + ' a rejoint la partie !');
        sockets.push(socket);
        // Confirmation au client qu'il est connecté au serveur
        socket.emit('playerJoined');
    });

    socket.on('serverSettings', function(startSetting){
    /*setting = {
        "nChasseur": 1,
        "nCupidon":1,
        "nloupgarou":2,
        "nPetitefille":1,
        "nSorciere":1,
        "nVillageois":6,
        "nVoleur":1,
        "nVoyante":1
    };*/
        if (startSetting['nLoupgarou']<0) {
          socket.emit("Nombre de loup garou négatif...");
          return
        }else{
        let nbLg = startSetting['nLoupgarou'];
        };
        if (startSetting['nVillageois']<0) {
          socket.emit("Nombre de villageois négatif...");
          return
        }else{
          let nbVil = startSetting['nVillageois'];
        };

        if(startSetting['nChasseur']>1||startSetting['nChasseur']<0){
          socket.emit("trop de chasseur");
          return;
        }else{
          let nbCha = startSetting['nbChasseur'];
        };

        if(startSetting['nCupidon']>1||startSetting['nCupidon']<0){
          socket.emit("trop de cupidon");
          return;
        }else{
          let nbCup = startSetting['nCupidon'];
        };
        if(startSetting['nPetitefille']>1||startSetting['nPetitefille']<0){
          socket.emit("trop de petite fille");
          return;
        }else{
          let nbPf = startSetting['nPetitefille'];
        };
        if(startSetting['nSorciere']>1||startSetting['nSorciere']<0){
          socket.emit("trop de sorciere");
          return;
        }else{
          let nbSor = startSetting['nSorciere'];
        };
        if(startSetting['nVoleur']>1||startSetting['nVoleur']<0){
          socket.emit("trop de voleur");
          return;
        }else{
          let nbVol = startSetting['nVoleur'];
        };
        if(startSetting['nVoyante']>1||startSetting['nVoyante']<0){
          socket.emit("trop de voyante");
          return;
        }else{
          let nbVoy = startSetting['nVoyante'];
        };

        if(nbVoy-2*nbVol+nbSor+nbLg+nbVil+nbPf+nbCha+nbCup!=sockets.length){
          socket.emit("Mauvaise configuration: Le nombre de carte ne convient pas au nombre de joueurs.")
          return
        }else{



        }


      };
    });

    // Détecter un client qui déconnecte (rafraîchissement / fermeture de l'onglet)
    socket.on('disconnect', (reason) => {
        console.log(reason);
    })
});

// lancement automatique de la partie

/*
setTimeout(() => {
    launchGame();
}, 8000);
*/

clientServer.listen(clientPort);
console.log('-------------------------------------------------------------------');
console.log('Serveur LoupGarou lancé sur le port ' + serverPort + '...');
console.log('En attente de joueurs sur le port ' + clientPort + '...');
console.log('-------------------------------------------------------------------');


// -----------------------------------------------------------------------------
// Fonctions internes
// -----------------------------------------------------------------------------

function getConnectedPlayers() {
    let ret = [];

    for(let i=0, len=sockets.length; i<len; i++) {
        let curr = sockets[i].pseudo;
        ret.push(curr);
    }

    return ret;
}

function isPseudoAlreadyUsed(pseudo) {
    let players = getConnectedPlayers();
    for(let i=0, len=players.length; i<len; i++)
        if(players[i] === pseudo)
            return true;
    return false;
}

function launchGame(startSetting) {

    gameEngine.initGame(sockets.length);

    // distribution des cartes
    for(let i in sockets) {
        let card = gameEngine.getCard();
        sockets[i].card = card;
        sockets[i].emit('gameStarted', card);
    }

    // lancement de la partie
    gameEngine.launchGame();
}

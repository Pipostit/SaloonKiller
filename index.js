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
    socket.on('newPlayer', function(pseudo) {
        if(isPseudoAlreadyUsed(pseudo)) {
            socket.emit('pseudoAlreadyUsed');
            return;
        }
        socket.pseudo = pseudo;
        console.log(pseudo + ' a rejoint la partie !');
        sockets.push(socket);
        // Confirmation au client qu'il est connecté au serveur
        socket.emit('playerJoined');
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
//console.log('Serveur LoupGarou lancé sur le port ' + serverPort + '...');
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

function launchGame() {
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

var http = require('http');
var fs = require('fs');
var path = require('path');

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
    fs.readFile('./client/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
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
        socket.pseudo = pseudo;
        console.log(pseudo + ' a rejoint la partie !');
        sockets.push(socket);
        // Confirmation au client qu'il est connecté au serveur
        socket.emit('playerJoined');
    });
});

setInterval(() => {
    console.log('Joueurs connectés : ' + getConnectedPlayers());
}, 5000);


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

function launchGame() {
    for (let i in sockets)
        sockets[i].emit('gameStarted');
}

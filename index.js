var http = require('http');
var fs = require('fs');

let clientPort = 8080;
let serverPort = 8081;

var indexServer = http.createServer(function(req, res) {
    fs.readFile('./main/main.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
indexServer.listen(serverPort);

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
    // Fonction callback

    console.log('Un joueur est connecté !');
    // Envoie un message à tous les clients connectés
	// socket.broadcast.emit('message', 'Un autre joueur vient de se connecter !');

    // Envoie un message via le socket courant
    // socket.emit('message', 'yo test');

    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function (message) {
        console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
    });

    // Mettre des informations en mémoire concernant le socket courant
    socket.on('newPlayer', function(pseudo) {
        socket.pseudo = pseudo;
    });
});


clientServer.listen(clientPort);
console.log('Serveur LoupGarou lancé sur le port ' + serverPort + '...');
console.log('En attente de joueurs sur le port ' + clientPort + '...');

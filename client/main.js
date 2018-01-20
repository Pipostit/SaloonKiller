var port = 8080;
var socket = io.connect('http://localhost:' + port);
let cardsEnum = Object.freeze({
    "chasseur":1,
    "cupidon":2,
    "loupgarou":3,
    "petitefille":4,
    "sorciere":5,
    "villageois":6,
    "voleur":7,
    "voyante":8
});
let container = document.getElementsByClassName('container')[0];
let cardImage = document.getElementById('cardImage');
let indicator = document.getElementById('indicator');
let indicatorText = document.getElementById('indicatorText');
let role = 0;

function connectToServer() {
    socket.open();
    socket.emit('newPlayer', document.getElementById("pseudo").value);
}

socket.on('playerJoined', function() {
    document.getElementById('connexionForm').style.display = 'none';
    document.getElementById('indicator').innerText = 'En attente du début de partie...';
});

socket.on('pseudoAlreadyUsed', () => {
    document.getElementById('indicator').innerText = 'Pseudo déjà pris !';
});


// Détecter la perte de connexion
socket.on('disconnect', (reason) => {
    console.log('Perte de connexion avec le serveur : ' + reason);
    socket.close();
    container.removeEventListener('touchstart', flippingCardListener);
    showConnexionScreen();
});

socket.on('gameStarted', (data) => {
    document.getElementById('info').className = 'cardInfo';
    role = data;
    initCardsImages(role);

    // attente de la fin de l'animation de la pop-up info
    setTimeout(() => {
        document.getElementById('flip-container').style.display = 'block';
        container.addEventListener('touchstart', flippingCardListener);
        initInfoPopup(role);
    }, 1000);
});

function flippingCardListener() {
    container.classList.toggle('hover');
}

function showConnexionScreen() {
    document.getElementById('info').className = '';
    document.getElementById('flip-container').style.display = 'none';
    document.getElementById('connexionForm').style.display = 'block';
    indicator.innerText = 'Connexion perdue';
    indicatorText.innerText = '';
}

function initCardsImages(role) {
    let imageName = '';
    switch (role[0]) {
        case cardsEnum.chasseur:
            imageName = 'chasseur.png';
            break;
        case cardsEnum.cupidon:
            imageName = 'cupidon.png'
            break;
        case cardsEnum.petitefille:
            imageName = 'petitefille.png';
            break;
        case cardsEnum.sorciere:
            imageName = 'sorciere.png';
            break;
        case cardsEnum.voleur:
            imageName = 'voleur.png';
            break;
        case cardsEnum.voyante:
            imageName = 'voyante.png';
            break;
        case cardsEnum.villageois:
            imageName = 'villageois.png';
            break;
        case cardsEnum.loupgarou:
            imageName = 'loupgarou.png';
            break;
        default:
            imageName = 'dos.png';
            break;
    }
    cardImage.src = 'cartes/' + imageName;
}

function initInfoPopup(role) {
    switch (role[0]) {
        case cardsEnum.chasseur:
            indicator.innerText = 'Tu es le chasseur !';
            indicatorText.innerText = 'Si tu es tué, tu pourras abattre une personne de ton choix avant de mourir.';
            break;
        case cardsEnum.cupidon:
            indicator.innerText = 'Tu es Cupidon !';
            indicatorText.innerText = 'Lors du tour préliminaire, tu désignes 2 personnes, qui deviennent alors amoureux.';
            break;
        case cardsEnum.petitefille:
            indicator.innerText = 'Tu es la petite fille !';
            indicatorText.innerText = 'Tu peux observer discrètement pendant le tour des loups ; attention à ne pas te faire attraper...';
            break;
        case cardsEnum.sorciere:
            indicator.innerText = 'Tu es la sorcière !';
            indicatorText.innerText = 'Tu possèdes une potion de vie et une autre de mort, qui peuvent respectivement sauver et tuer quelqu\'un.';
            break;
        case cardsEnum.voleur:
            indicator.innerText = 'Tu es le voleur !';
            indicatorText.innerText = 'Lors du tour préliminaire, tu peux choisir ton rôle parmi 2 cartes non-distribuées.';
            break;
        case cardsEnum.voyante:
            indicator.innerText = 'Tu es la voyante !';
            indicatorText.innerText = 'Tu peux, à chaque tour, découvrir le véritable rôle d\'un joueur.';
            break;
        case cardsEnum.villageois:
            indicator.innerText = 'Tu es un villageois !';
            indicatorText.innerText = 'Ton objectif est de tuer tous les loups-garous qui menacent ton village.';
            break;
        case cardsEnum.loupgarou:
            indicator.innerText = 'Tu es un Loup-Garou !';
            indicatorText.innerText = 'Ton objectif est, en coopération avec les autres loups, de tuer tous les villageois.';
            break;
        default:
            indicator.innerText = 'Tu es un bug !';
            indicatorText.innerText = 'Ton rôle est de débuguer SaloonKiller, qui n\'a pas su reconnaître ton rôle !';
            break;
    }

}

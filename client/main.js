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
    socket.emit('newPlayer', document.getElementById("pseudo").value);
}

socket.on('playerJoined', function() {
    document.getElementById('connexionForm').style.display = 'none';
    document.getElementById('indicator').innerText = 'En attente du début de partie...';
});

socket.on('gameStarted', (data) => {
    document.getElementById('info').className = 'cardInfo';
    role = data;
    initCardsImages(role);

    // attente de la fin de l'animation de la pop-up info
    setTimeout(() => {
        document.getElementById('flip-container').style.display = 'block';
        container.addEventListener('touchstart', () => {
            container.classList.toggle('hover');
        });
        initInfoPopup(role);
    }, 1000);
});


function initCardsImages(role) {
    let imageName = '';
    switch (role[0]) {
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

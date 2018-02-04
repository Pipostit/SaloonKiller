let gameEngine = (function() {
    let self = this;
    let cards = [];
    self.cardsEnum = Object.freeze({
        "chasseur":1,
        "cupidon":2,
        "loupgarou":3,
        "petitefille":4,
        "sorciere":5,
        "villageois":6,
        "voleur":7,
        "voyante":8
    });

    /**
      * Initialise la partie
      * @param {dictionary of Integer} startSetting - Nombre de carte par roles
      * @param {Integer} n - nombre de joueurs
      *setting = {
      *  "chasseur": 1,
      *  "cupidon":1,
      *  "loupgarou":2,
      *  "petitefille":1,
      *  "sorciere":1,
      *  "villageois":6,
      *  "voleur":1,
      *  "voyante":1
      *};
      * @todo remplir la pile en fonction des roles demandés
      **/
    self.initGame = (startSettings, n) => {
        console.log('\nInitialisation de la partie avec ' + n + ' joueurs...\n');
        console.log(startSettings);

        let keys = Object.keys(startSettings);
        for(let i=0,len=keys.length; i<len; i++) {
            let curr = keys[i];
            for(let j=0;len = parseInt(startSetting[curr]);j++){
              cards.push(self.cardsEnum[curr]);
            }
        }
        cards = shuffleCard(cards);

        console.log('La pile de cartes a été remplie avec assez de cartes et mélangée.')
    };

    /**
      * Retourne une carte choisie aléatoirement dans la pile de cartes.
      * Est appelée pour fournir une carte à chaque joueur.
      * @todo renvoyer une carte random de la pile
      **/

    self.getCard = () => {
        let leftCards = (cards.length-1);
        if(leftCards !== 0)
            console.log('   Carte distribuée, il en reste ' + leftCards + ' dans la pile.');
        else
            console.log('   Toutes les cartes ont été distribuées.');
        return cards.splice(0,1);
    };

    /**
      * Gère l'exécution d'une partie
      * @todo Implémenter la boucle de jeu
      **/
    self.launchGame = () => {
        console.log('\nLancement de la partie...\n');
    };

    return self;
})();

module.exports = gameEngine;


function getRandomInt(min, max) {
    /*renvoie un entier entre min et max exclu*/
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffleCard(deck){
    /*
      function return a shuffle version of the deck
      entry: deck is an Array
      return: shuffleDeck a new Array
    */

    pool = new Array();
    for (i = 0; i < deck.length; i++) {
        pool[i] = i;
    }
    shuffleDeck = new Array();
    for (i = 0; i < deck.length; i++){
        k = getRandomInt(0,pool.length);
        shuffleDeck[i] = deck[pool.splice(k,1)];
    }

    return shuffleDeck;
}

let gameEngine = (function() {
    let self = this;
    let cards = [];
    let state = 0; // La partie n'est pas encore lancée
    self.setting =  {
        "chasseur": 0,
        "cupidon": 0,
        "loupgarou": 0,
        "petitefille": 0,
        "sorciere": 0,
        "villageois": 0,
        "voleur": 0,
        "voyante": 0
    };
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
        self.setting = startSettings;
        let keys = Object.keys(startSettings);
        for(let i=0,len=keys.length; i<len; i++) {
            let curr = keys[i];
            for(let j=0;j<parseInt( startSettings[curr] );j++){
              cards.push(self.cardsEnum[curr]);
            }
        }
        cards = shuffleCard(cards);
        console.log('La pile de cartes a été remplie avec assez de cartes et mélangée.');
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
        self.state = 5; //Lancement de la Partie, state 5 correspond au tour du voleur
    };
    self.currentBroadcastMessage = () =>{
      // Renvoie le message qui va être broadcast au joueurs pendant le tour sous la forme {'m':msg,'gm':gameMessage}
      // gameMessage represente le tour et msg le message qui sera affiché dans le jeu
      let gameMessage = "gameMessage par defaut";
      let msg = "msg par defaut"
      switch(self.state){
      case 1:
        gameMessage = "wakeUp";
        msg = "Le village se réveille.";
        break;

      case 2:
        msg = "debate";
        gameMessage = "C'est l'heure du débat!";
      break;
      case 3:
        msg = "vote";
        gameMessage = "C'est l'heure du vote!";
        break;

      case 4:
        msg = "killByVillage";
        gameMessage = "Le village à voté! Il execute quelqu'un et s'endort";
        break;
      case 5:
        gameMessage = "voleur";
        msg = "C'est le tour du voleur.";
        break;

      case 6:
        msg = "voyante";
        gameMessage = "C'est le tour de la voyante.";
      break;
      case 7:
        gameMessage = "loup";
        msg = "C'est le tour des loups.";
        break;

      case 8:
        msg = "sorciere";
        gameMessage = "C'est le tour de la sorcière.";
      break;
      }
      return [msg,gameMessage];
    }

    // Fonction vérifiant si la partie doit continuer
    self.itIsTheEnd = (sockets) =>{

      // Flag permet de determiner si la partie continue ou non
      // On va dans un premier temps vérifier si les amoureux ont gagné
      let nbJoueur = 0;
      let nbAmoureux = 0;
      for(let i in sockets){
        if(sockets[i].enVie){
          nbJoueur+=1;
          if(sockets[i].amoureux){
            nbAmoureux += 1
          }
        }
      }
      if(nbAmoureux == nbJoueur){
        return true;
      }
      // On regarde ensuite si les villageois ont tué tous les loupsgarous

      else if(setting.loupgarou==0){
        return true;

      // On vérifie le cas de la victoire des loupsgarous
      }else{

        // Keys represente une liste de tous les rôles sous la forme d'une liste de chaine de caractères
        let keys = Object.keys(setting);

        for(let i=0,len=keys.length; i<len; i++) {

            // role represente le role que l'on est en train de vérifier, comme une chaîne de caractères
            let role = keys[i];

            if(role != "loupgarou" && setting[role] > 0 ){
              return false
            }
          }
      }

      return true
    }
    self.nextState = (sockets) =>{
      currentState = self.state;

      switch(currentState) {
        case 1:
            let flag1 = self.itIsTheEnd(sockets);
            if(flag1){
              self.state = -1; //fin de la Partie
            }else{
              self.state = 2; //Début du débat
            }
            break;
        case 2:
            self.state = 3; //Lancement du vote du village
            break;
        case 3:
          let flag3 = self.itIsTheEnd(sockets);
          if(flag3){
            self.state = -1; //fin de la Partie
          }else{
            self.state =  4; //Elimination d'un joueur et début de la nuit
          }
          break;
        case 4:
          self.state =  5;// tour Voleur
          break
        case 5:
          self.state =  6;// tour Voyante
          break
        case 6:
          self.state =  7;// tour loups
          break
        case 7:
          self.state =  8;// tour sorciere
          break
        case 8:
          self.state =  1;// fin de la nuit
          break

        default:
          self.state = 0; //Probleme
      }

    }

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

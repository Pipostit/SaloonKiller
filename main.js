
var idServ;
var playerName;
var bJoin;
var bCreate;

bJoin = Document.getElementById("join");
bCreate = Document.getElementById("create");

bJoin.onclick = function(){
  idServ = Document.getElementById("saloon").value;
  playerName = Document.getElementById("name").value;
  /* join(idServ,playerName)*/
};

bCreate.onclick = function(){
  playerName = Document.getElementById("name").value;
  /* create(idServ,playerName)*/
  
};



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

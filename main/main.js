var idServ;
var bJoin;
var bCreate;
var nbLoup;
var nbVil;
var rangeBoxLg;
var rangeBoxVil;
var bJoin = Document.getElementById("join");
var bCreate = Document.getElementById("create");
Document.getElementById('nbLoup').onchange = function(){
  document.getElementById('rangeBoxLg').value = Document.getElementById('nbLoup').value;
} ;

bJoin.onclick = function(){
  idServ = Document.getElementById("saloon").value;
  /* join(idServ,playerName)*/
};

bCreate.onclick = function(){
  nbLoup = Document.getElementById("nbLoup").value;
  nbVil = Document.getElementById("nbVil").value;
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

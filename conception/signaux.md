# Signaux utilisés

## Admin


## Client

### Client => Serveur

* `newPlayer` : envoyé quand un nouveau client lance la connexion

### Serveur => Client

* `playerJoined` : confirmation que le nouveau client est bien connecté
* `pseudoAlreadyUsed` : le client a tenté de se connecter avec un pseudo déjà utilisé
* `gameStarted` : envoyé au lancement de la partie
* `sorciereTurn`
* `cupidonTurn`
* `loupTurn`

var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Le compteur
let compteur = 0;

//les messages (on stocke désormais avec un pseudo et une date)
let allMsgs = [
  { pseudo: "Admin", msg: "Hello World", date: new Date().toLocaleString },
  { pseudo: "Admin", msg: "Bonjour utilisateur", date: new Date().toLocaleString },
];
// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

//rourte permettant de rendre un objet javascript {"a": 1, "b" : 2}
app.get('/test/1', function(req, res) {
  res.send({ "a": 1, "b": 2 })
});

//route permettant de rendre "hello world"
app.get('/test/2', function(req, res) {
  res.send("Hello World")
});
//route permettant de renvoyer le nombre 42
app.get('/test/3', function(req, res) {
  res.send("42")
});

// route qui renvoie le contenu de la route
app.get('/test/*', function(req, res) {
  let param = req.url.substr(6); // on récupère le contenu apres /test/
  res.send({ "msg": param });
});

//route qui renvoie un fichier json avec la valeur du compteur 
app.get('/cpt/query', function(req, res) {
  res.json({ "compteur": compteur });
});

//definition de l'incrémentation du compteur
app.get('/cpt/inc', function(req, res) {
  let increment = 1;
  if (req.query.v) {
    if (req.query.v.match(/^\d+$/)) {
      increment = parseInt(req.query.v, 10);
    } else {
      return res.json({ "code": -1 });
    }
  }
  compteur += increment;
  res.json({ "code": 0 });
});

//Poster un message 
/* ancienne version 
app.get('/msg/post/*', function(req, res) {
  let message = unescape(req.url.substr(10)); // Decodage du message pour garder le format valide (ex : Hello World -> Hello%20World)
  allMsgs.push(message);
  res.json({ "msgIndex": allMsgs.length - 1 }); // Retourne l'index du message ajouté
});
*/

//Nouvelle version avec pseudo et date 
app.get('/msg/post/*', function(req, res) {
  let url = req.url.substr(10); // on récupère le message et le pseudp 
  let part = url.split("?pseudo="); //on sépare message et pseudo 
  let message = unescape(part[0]);
  let pseudo = part.length > 1 ? unescape(part[1]) : "Anonyme";;
  let date = new Date().toLocaleString();
  let newMessage = {
    pseudo: pseudo,
    msg: message,
    date: date
  };
  allMsgs.push(newMessage);
  res.json({ "msgIndex": allMsgs.length - 1 });
});

//récupérer un message par son num 
app.get('/msg/get/*', function(req, res) {
  let index = parseInt(req.url.substr(9), 10);
  if (!isNaN(index) && index >= 0 && index < allMsgs.length) { //test de la validité de l'index 
    res.json({ "code": 1, "msg": allMsgs[index] });
  } else {
    res.json({ "code": 0 });
  }
});

//Récupérer tous les messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});
//Récupérer le nmb de message 
app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});
//Supprimer un message 
app.get('/msg/del/*', function(req, res) {
  let index = parseInt(req.url.substr(9), 10);
  if (!isNaN(index) && index >= 0 && index < allMsgs.length) { //test de la validité de l'index
    allMsgs.splice(index, 1); // On supprime le message 
    res.json({ "code": 1, "message supprimé": "" });
  } else {
    res.json({ "code": 0 });
  }
});


app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");


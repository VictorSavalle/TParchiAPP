//fonction de calcul de factorielle 
function factorielle(n){
    if (n==0 || n==1){
        return 1;
    }
    return n*factorielle(n-1);
}
//affichage dans la console de !6
console.log(factorielle(6));
//fonction qui applique f a un tab
function applique(f, tab) {
    return tab.map(f);
}
//test avec factorielle
console.log(applique(factorielle, [1,2,3,4,5,6]));
//test avec la fonction incremente
console.log(applique(function(n) { return (n+1); } , [1,2,3,4,5,6]));

// Définition du tableau de messages
let msgs = [
    { pseudo: "Bonjour", msg: "Ecrivez un message", date: new Date().toLocaleString() }
  ];
  
  // Fonction pour mettre à jour la liste des messages
function update(messages) {
    let messageList = document.getElementById("message-list");
    messageList.innerHTML = ""; // Efface les messages existants
    messages.forEach(message => {
        let li = document.createElement("li");
        // Affichage avec pseudo et date
        li.innerHTML = `<strong>${message.pseudo}</strong> : ${message.msg} (${message.date})` ;
        messageList.appendChild(li);
    });
}
update(msgs);

/* Ancienne fonction de bouton 
  // Ajout d'un événement sur le bouton pour mettre à jour les messages
document.getElementById("bouton_d'envoi").addEventListener("click", function() {
    let pseudo = document.getElementById("pseudo").value.trim();
    let message = document.getElementById("message-posté").value.trim();
    if (pseudo === "" || message === "") {
        alert("Veuillez renseigner à la fois le pseudo et le message.");
        return;
    }
    // Ajoute le message avec la date actuelle
    msgs.push({
        pseudo: pseudo,
        msg: message,
        date: new Date().toLocaleString()
    });
    update(msgs);
});*/

/*
//Nouvelle version permettant d'envoyer le message au serveur
document.getElementById("bouton_d'envoi").addEventListener("click", function() {
    let pseudo = document.getElementById("pseudo").value.trim();
    let message = document.getElementById("message-posté").value.trim();
    if (pseudo === "" || message === "") {
        alert("Veuillez renseigner à la fois le pseudo et le message.");
        return;
    }

    // Envoyer le message au serveur
    fetch(`https://94949b39-31a7-463a-924e-83622b6e7094-00-30zchri2x26v0.spock.replit.dev/msg/post/${encodeURIComponent(message)}?pseudo=${encodeURIComponent(pseudo)}`) //Pas besoin d'ajouter la date, le traitement est fait coté serveur
    .then(response => response.json())
    .then(() => {
        updateFromServer(); // Rafraîchir la liste des messages
    })
    .catch(error => console.error("Erreur lors de l'envoi du message :", error));
});
*/

//Version permettant le contact avec un autre URL 
document.getElementById("bouton_d'envoi").addEventListener("click", function() {
    let pseudo = document.getElementById("pseudo").value.trim();
    let message = document.getElementById("message-posté").value.trim();
    if (pseudo === "" || message === "") {
        alert("Veuillez renseigner à la fois le pseudo et le message.");
        return;
    }

    // Envoyer le message au serveur
    fetch(`${serverUrl}/msg/post/${encodeURIComponent(message)}?pseudo=${encodeURIComponent(pseudo)}`)
    .then(response => response.json())
    .then(() => {
        updateFromServer(); // Rafraîchir la liste des messages après envoi
        document.getElementById("message-posté").value = ""; 
    })
    .catch(error => console.error("Erreur lors de l'envoi du message :", error));
});

// Récupérer l'URL du micro-service depuis le stockage local (ou utiliser une valeur par défaut)
let serverUrl = localStorage.getItem("serverUrl") || "https://94949b39-31a7-463a-924e-83622b6e7094-00-30zchri2x26v0.spock.replit.dev";

// Met à jour l'input avec l'URL actuelle
document.getElementById("server-url").value = serverUrl;

// Fonction pour enregistrer l'URL du serveur
document.getElementById("save-server-url").addEventListener("click", function() {
    serverUrl = document.getElementById("server-url").value.trim();
    localStorage.setItem("serverUrl", serverUrl); // Stocker l'URL localement
    alert("URL du serveur mise à jour !");
    updateFromServer(); // Recharger les messages immédiatement
});

// Bouton de mise à jour pour rafraîchir l'affichage (on ajoute la fonction updateFromServer au bouton)
document.getElementById("bouton_MAJ").addEventListener("click", updateFromServer);


// Bouton pour changer le style (passage de clair à sombre)
document.getElementById("changer-style").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

//Cette fonction n'est plus utile, pas d'interet réel au pop-up

/* fetch('https://94949b39-31a7-463a-924e-83622b6e7094-00-30zchri2x26v0.spock.replit.dev/msg/getAll') 
  .then(function(response) {
    return response.json(); // Convertit la réponse en JSON
  })
  .then(function(data) {
    if (data.length > 0) {
      alert(data[0]); // Affiche le premier message du micro-service dans un pop-up
    } else {
      alert("Aucun message disponible");
    }
  })
  .catch(function(error) {
    console.error("Erreur lors de la récupération des messages :", error);
  }); */

// Fonction pour mettre à jour la liste des messages depuis le serveur
function updateFromServer() {
    fetch(`${serverUrl}/msg/getAll`)
    .then(response => response.json()) // Convertir en JSON
    .then(messages => {
        let messageList = document.getElementById("message-list");
        messageList.innerHTML = ""; // Vider la liste avant de la remplir
        messages.forEach(message => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${message.pseudo}</strong> : ${message.msg} <br> <small>${message.date}</small>`;
            messageList.appendChild(li);
        });
    })
    .catch(error => console.error("Erreur lors de la récupération des messages :", error));
}

// Charger les messages au démarrage
document.addEventListener("DOMContentLoaded", updateFromServer);
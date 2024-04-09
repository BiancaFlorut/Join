let url = window.location.href;
/**
 * function change die <img> src path, whenn we hover the mouse ofer the <a>
 */
document.addEventListener('DOMContentLoaded', function() {
    function toggleImage(elementId, hoverSrc, originalSrc) {
        let linkElement = document.getElementById(elementId);
        linkElement.addEventListener('mouseover', function() {
            this.querySelector('img').src = hoverSrc;
        });
        linkElement.addEventListener('mouseout', function() {
            this.querySelector('img').src = originalSrc;
        });
    }

    toggleImage('todoLink', '../../img/todo_hover.svg', '../../img/todo.svg');
    toggleImage('doneLink', '../../img/done_hover.svg', '../../img/done.svg');
});



/*
|/////////////////////////////////////////////////////////////|
|                                                             |
|                                                             |
|-------------------->ATTENTION: TESTAREA<--------------------|
|                                                             |
|                                                             |
|/////////////////////////////////////////////////////////////|
*/


let params = new URLSearchParams(new URL(url).search);

let urlEmail = params.get('email');

console.log(urlEmail);

function findeBenutzerNachEmail(users, urlEmail) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === urlEmail) {
            return users[i];
        }
    }
    return null; // Wenn kein Benutzer gefunden wird
}

let user = findeBenutzerNachEmail(users, urlEmail);

if (user) {
    console.log("Benutzer gefunden:", user.name);
} else {
    console.log("Benutzer nicht gefunden.");
}

/**
 * function extract initials from a namestring
 * 
 * @param {*} name 
 * @returns
 */
function extrahiereAnfangsbuchstaben(name) {
    let words = name.split(' '); // zerlegt den Namen in "Wörter"
    let initialLetters = []; // Anfangsbuchstaben speichern
    
    for (let i = 0; i < words.length; i++) { // Gehe durch jedes Wort im Namen
        initialLetters.push(words[i].charAt(0)); // Füge den ersten Buchstaben des Wortes zum Array der Anfangsbuchstaben hinzu
    }
    return initialLetters.join(''); // Gib die Anfangsbuchstaben als String zurück
}

console.log(extrahiereAnfangsbuchstaben(name))
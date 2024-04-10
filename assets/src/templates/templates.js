const urlParams = new URLSearchParams(window.location.search);
const emailParameter = urlParams.get('email');
const contactIconColors = [
    '#ff7a00',
    '#ff5eb3',
    '#6e52ff',
    '#9327ff',
    '#00bee8',
    '#1fd7c1',
    '#ff745e',
    '#ffa35e',
    '#fc71ff',
    '#ffc701',
    '#0038ff',
    '#c3ff2b',
    '#ffe62b',
    '#ff4646',
    '#ffbb2b',
];
let initialLetters = [];

function templatesInit() {
    extractFirstLetters();
}

/**
 * this function integrates html templates
 *
 * @param {html-include} templates
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file); 
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * this function makes a menu appear, for this I delete the div a css class called d-none
 *
 * @param {class} class
 */
function openPopupMenu() {
    let element = document.getElementById("popupMenuHeader");
    element.classList.remove("d-none");
}

/**
 * this function makes a menu disappear, for this I give the div a css class called d-none
 *
 * @param {class} class
 */
function closePopupMenu() {
    let element = document.getElementById("popupMenuHeader");
    element.classList.add("d-none");
}

/**
 * function to show where you are on the nav-bar
 * 
 * 
 */
function selectedPage() {
    let element = document.getElementById(`${document.title}`);
    element.classList.add("selected-page");
}
/**
 * the function sets the parameter query for board in order to load information from server for the logged user.
 */
function setParameterQuery() {
    document.getElementById('Board').href = '../board/board.html?email=' + emailParameter;
    document.getElementById('Contacts').href = '../contacts/contacts.html?email=' + emailParameter;
}

/**
 * function extract initials from a namestring
 * 
 * @param {*} name 
 * @returns
 */
async function extractFirstLetters() {
    let user = await getUserFromServer(emailParameter);
    let words = (user.name).split(' '); // zerlegt den Namen in "Wörter"
    for (let i = 0; i < words.length; i++) { // Gehe durch jedes Wort im Namen
        initialLetters.push(words[i].charAt(0)); // Füge den ersten Buchstaben des Wortes zum Array der Anfangsbuchstaben hinzu
        showInitials();
    }
    return initialLetters.join(''); // Gib die Anfangsbuchstaben als String zurück
}

/**
 * function to show the initials
 * 
 * @param {string}
 */
function showInitials() {
    let welcome = document.getElementById('userInitials');
    welcome.innerHTML = ``;
    for (let i = 0; i < initialLetters.length; i++) {
        let element = initialLetters[i];
        welcome.innerHTML += `${element}`;
    }
}
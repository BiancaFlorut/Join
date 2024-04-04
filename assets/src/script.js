const STORAGE_TOKEN = 'A4FWT6VNANE57F3YJWY8RKAO2BLJ7XU20BKY7G0X';
const STORAGE_URL = ' https://remote-storage.developerakademie.org/item';

/**
 * The function calls the remote saved data with the key parameter.
 * 
 * @param {string} key 
 * @returns the value of the saved data with the key and token
 */
function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL);
}

async function init() {
    await includeHTML(); // hier wird auf includeHTML gewartet, bis es komplett fertig ist, ohne das await werden beide fast zeitgleich verarbeitet und führt zu fehlermeldungen
    document.getElementById('headline').innerHTML = 'Herzlich willkommen!'; // soll die Überschrift im header ändern
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html" 
        let resp = await fetch(file); // fetch holt sich informationen ausm netz
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}
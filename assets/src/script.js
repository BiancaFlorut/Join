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
    await includeHTML();
}


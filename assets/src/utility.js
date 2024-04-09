const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('myParam');

/**
 * Handy function to get element by id.
 * @param {string} id 
 * @returns DOM element
 */
function getElementWithId(id) {
  return document.getElementById(id);
}


/**
 * Handy function to get element by id.
 * @param {string} id 
 * @returns HTMLElement
 */
function getElementWithId(id) {
  return document.getElementById(id);
}

/**
 * This functions adds a display none class to the element with the id given as parameter.
 * @param {string} id 
 */
function hideElement(id) {
  getElementWithId(id).classList.add('d_none');
}

/**
 * This functions removes the display none class from the element with the id given as parameter.
 * @param {string} id 
 */
function showElement(id) {
  getElementWithId(id).classList.remove('d_none');
}

/**
 * The function changes the source path of the image element.
 * 
 * @param {img element Object} element
 * @param {string} src
 */
function changeSrc(element, src) {
  element.src = src;
}
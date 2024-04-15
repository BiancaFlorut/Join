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
 * @param {HTMLImageElement} element
 * @param {string} src
 */
function changeSrc(element, src) {
  element.src = src;
}

/**
 * This function simulates the behavior of a checkbox by clicking on an img element given hier as a parameter (checkbox) and changes its state as checked or not.
 * 
 * @param {HTMLImageElement} checkbox - the element wich represents the checkbox.
 * @param {boolean} isToggled - a boolean wich gives the state of the checkbox as checked or not.
 * @returns {boolean} isToggled.
 */
function toggleCheckbox(checkbox, isToggled, path) {
  if (isToggled) {
    checkbox.src = path + ".svg";
    isToggled = false;
  } else {
    checkbox.src = path + "_checked.svg";
    isToggled = true;
  }
  return isToggled;
}

/**
 * This function changes the image source of the checkbox when the mouse is over the image and simulates the hover effect but only the mouseOver.
 *
 * @param {HTMLImageElement} element
 */
function mouseOver(element, isToggled) {
  if (isToggled) {
    changeSrc(element, CHECKBOX_PATH + "_checked_hover.svg");
  } else changeSrc(element, CHECKBOX_PATH + "_hover.svg");
}

/**
 * On mouseout ist this function called to change the source of the image in order to simulate and hover effect of the checkbox.
 * 
 * @param {HTMLImageElement} element
 */
function mouseBeside(element, isToggled) {
  if (isToggled) element.src = CHECKBOX_PATH + "_checked.svg";
  else element.src = CHECKBOX_PATH + ".svg";
}

/**
 * Function takes the name and returns the first two letters. For the user, the name is with (You), and the function skips the '(' character.
 * @param {string} name 
 * @returns string
 */
function getInitials(name) {
  let initials = '';
  const names = name.split(" ");
  names.forEach((name) => {
    initials += !(name.charAt(0) == '(') ? name.charAt(0) : '';
  });
  return initials;
}

/**
 * This function check if the string parameter is only whitespace.
 * @param {string} string 
 * @returns boolean
 */
function isWhiteSpaceOnly(string) {
  return string.replace(/\s/g, '').length == 0 ? true : false;
}
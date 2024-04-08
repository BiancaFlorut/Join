const CHECKBOX_PATH = "../../../img/checkbox";

/**
 * This function changes the image source of the checkbox when the mouse is over the image and simulates the hover effect but only the mouseOver.
 *
 * @param {img element} element
 */
function mouseOver(element, isToggled) {
  if (isToggled) {
    changeSrc(element, CHECKBOX_PATH + "_checked_hover.svg");
  } else changeSrc(element, CHECKBOX_PATH + "_hover.svg");
}

/**
 * On mouseout ist this function called to change the source of the image in order to simulate and hover effect of the checkbox.
 * 
 * @param {img element} element
 */
function mouseBeside(element, isToggled) {
  if (isToggled) element.src = CHECKBOX_PATH + "_checked.svg";
  else element.src = CHECKBOX_PATH + ".svg";
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

/**
 * This function toggles the visibility of the password in the password input by clicking on the eyed.
 * 
 * @param {img element} element on wich the event was targeted.
 * @param {string} id of the password element.
 * @param {boolean} isToggled a boolean wich gives the state of the password as visible or not.
 * @returns {boolean} isToggled.
 */
function togglePassword(element, id, isToggled) {
  let passwordElement = document.getElementById(id);
  if (isToggled) {
    changeSrc(element, "../../../img/visibility_off.svg");
    passwordElement.type = "password";
    isToggled = false;
  } else {
    changeSrc(element, "../../../img/visibility.svg");
    passwordElement.type = "text";
    isToggled = true;
  }
  return isToggled;
}

/**
 * This function simulates the behavior of a checkbox by clicking on an img element given hier as a parameter (checkbox) and changes its state as checked or not.
 * 
 * @param {element} checkbox - the element wich represents the checkbox.
 * @param {boolean} isToggled - a boolean wich gives the state of the checkbox as checked or not.
 * @returns {boolean} isToggled.
 */
function toggleCheckbox(checkbox, isToggled) {
  if (isToggled) {
    checkbox.src = CHECKBOX_PATH + ".svg";
    isToggled = false;
  } else {
    checkbox.src = CHECKBOX_PATH + "_checked.svg";
    isToggled = true;
  }
  return isToggled;
}


async function init() {
  let usersResponse = await getItem("users");
  users = JSON.parse(usersResponse.data.value);
}
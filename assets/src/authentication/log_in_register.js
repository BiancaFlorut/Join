CHECKBOX_PATH = "../../../img/checkbox";

/**
 * This function toggles the visibility of the password in the password input by clicking on the eyed.
 * 
 * @param {HTMLElement} element on wich the event was targeted.
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
 * Initializes the function by fetching users data from the remote storage.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  users = await loadUsersFromServer();
}
const CHECKBOX_PATH = "../../../img/checkbox";

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


async function init() {
  let usersResponse = await getItemFromRemoteStorage("users");
  users = JSON.parse(usersResponse.data.value);
}
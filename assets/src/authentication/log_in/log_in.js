let users;
let isPasswordVisible = false;
let isRememberMeChecked = false;

/**
 * Toggles the visibility of the password in the password input by clicking on the eye icon.
 *
 * @param {HTMLElement} element - The element on which the event was triggered.
 * @param {string} id - The id of the password element.
 * @return {boolean} The updated state of the password visibility.
 */
function togglePasswordSignIn(element, id) {
  isPasswordVisible = togglePassword(element, id, isPasswordVisible);
}

/**
 * Toggles the state of the "Remember Me" checkbox.
 *
 * @param {Element} checkbox - The checkbox element that triggers the toggle.
 * @return {void} No return value.
 */
function toggleRememberMe(checkbox) {
    isRememberMeChecked = toggleCheckbox(checkbox, isRememberMeChecked, CHECKBOX_PATH);
}

/**
 * Calls the mouseOver function passing the provided element and the isRememberMeChecked state.
 *
 * @param {Element} element - The element triggering the mouse over event.
 * @return {void} No return value.
 */
function mouseOverRememberMe(element) {
  mouseOver(element, isRememberMeChecked);
}

/**
 * Calls the mouseOut function passing the provided element and the isRememberMeChecked state.
 *
 * @param {type} element - description of parameter
 * @return {type} description of return value
 */
function mouseBesideRememberMe(element) {
  mouseBeside(element, isRememberMeChecked);
}

/**
 * Logs in the user with the provided email and password.
 *
 * @return {Promise<void>} A promise that resolves when the login process is complete.
 */
async function logIn() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find((u) => u.email.toLowerCase() == email.value.toLowerCase() && u.password == password.value);
  if (user) {
    // setItemToRemoteStorage('actualUser', JSON.stringify(user));
    // await getItemFromRemoteStorage('actualUser');
    if (isRememberMeChecked) localStorage.setItem(email.value, password.value);
    else localStorage.setItem(email.value, '');
    window.location.replace('../../summary/summary.html?email='+user.email);
  }
  else {
    getElementWithId('errorPasswordMessage').classList.remove('d_none');
    getElementWithId('password').style.border = '1px solid rgba(255, 0, 31, 1)';
  }
}

/**
 * Checks if the provided email exists in the localStorage and if so, sets the password value in the password input field and toggles the remember me checkbox.
 *
 * @param {HTMLInputElement} inputElement - The email input element.
 * @return {void} This function does not return anything.
 */
function checkEmail(inputElement) {
  const email = inputElement.value;
  const password = localStorage.getItem(email);
  if (password) {
    document.getElementById("password").value = password;
    toggleRememberMe(getElementWithId('checkboxRememberMe'));
  }
}
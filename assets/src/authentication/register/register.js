let isCheckedPrivacyPolicy = false;
let isPasswordVisible = false;
let users = [];

/**
 * Resets the content by adding a class to hide the error message element.
 */
function resetContent() {
  document.createElement("errorPasswordMessage").classList.add("d_none");
}

/**
 * Toggles the visibility of the password in the password input by clicking on the eye icon.
 *
 * @param {HTMLElement} element - The element on which the event was triggered.
 * @param {string} id - The id of the password element.
 * @return {boolean} The updated state of the password visibility.
 */
function togglePasswordSignUp(element, id) {
  isPasswordVisible = togglePassword(element, id, isPasswordVisible);
  checkAllConditions();
}

/**
 * Toggles the privacy policy icon and updates the state of the checkbox.
 *
 * @param {Element} checkbox - The checkbox element.
 * @return {void} This function does not return anything.
 */
function togglePrivacyPolicyIcon(checkbox) {
  isCheckedPrivacyPolicy = toggleCheckbox(checkbox, isCheckedPrivacyPolicy, CHECKBOX_PATH);
  checkAllConditions();
}

/**
 * Calls the mouseOver function passing the provided element and the isCheckedPrivacyPolicy state.
 *
 * @param {Element} element - The element triggering the mouse over event.
 * @return {void} No return value.
 */
function mouseOverSignUp(element) {
  mouseOver(element, isCheckedPrivacyPolicy);
}

/**
 * Calls the mouseOut function passing the provided element and the isCheckedPrivacyPolicy state.
 *
 * @param {Element} element - The element triggering the mouse beside event.
 * @return {void} No return value.
 */
function mouseBesideSignUp(element) {
  mouseBeside(element, isCheckedPrivacyPolicy);
}

/**
 * The function reads the form input data and stores it in the remote server and redirects the user to log in.
 */
async function register() {
  if (isCheckedPrivacyPolicy) {
    document.getElementById("signUpButton").disabled = true;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const user = { name, email: email.toLowerCase(), password, color: selectRandomColor(), contacts: [], tasks: [] };
    user.categories = [
      { name: "Technical Task", color: "#1FD7C1" },
      { name: "User Story", color: "#0038FF" },
    ];
    user.contacts = [{ name: name + " (You)", email: email, color: selectRandomColor() }];
    if (!isEmailAlreadyRegistered(email)) {
      users.push(user);
      await setItemToRemoteStorage("users", JSON.stringify(users));
      getElementWithId("signUpSuccessfullyScreen").style.display = "flex";
      setTimeout(function () { window.location.replace("../log_in/log_in.html");}, 1600);
    }
    document.getElementById("signUpButton").disabled = false;
  }
}

/**
 * Checks if the given email is already registered.
 *
 * @param {string} email - The email to check.
 * @return {boolean} Returns true if the email is already registered, false otherwise.
 */
function isEmailAlreadyRegistered(email) {
  const emails = getEmailArray();
  if (emails.includes(email)) {
    getElementWithId("email").style.border = "1px solid rgba(255, 0, 31, 1)";
    getElementWithId("email").setCustomValidity("Email already exists!");
    return true;
  } else {
    getElementWithId("email").style.border = "1px solid green";
    getElementWithId("email").setCustomValidity("");
    return false;
  }
}

/**
 * The function checks if the password is the same with the confirmed password. If not an error message is shown.
 */
function onChange() {
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirmPassword");
  if (confirm.value == password.value) {
    document.getElementById("errorPasswordMessage").classList.add("d_none");
    getElementWithId("confirmPassword").style.border = "1px solid #d1d1d1";
    confirm.setCustomValidity("");
  } else {
    document.getElementById("errorPasswordMessage").classList.remove("d_none");
    getElementWithId("confirmPassword").style.border = "1px solid rgba(255, 0, 31, 1)";
  }
  checkAllConditions();
}

/**
 * Checks all the conditions for user sign up and enables/disables the sign up button accordingly.
 *
 */
function checkAllConditions() {
  if (
    getElementWithId("name").value &&
    getElementWithId("password").value == getElementWithId("confirmPassword").value &&
    getElementWithId("email").value &&
    isCheckedPrivacyPolicy &&
    !isEmailAlreadyRegistered(getElementWithId("email"))
  )
    getElementWithId("signUpButton").disabled = false;
  else document.getElementById("signUpButton").disabled = true;
}

/**
 * Returns an array of email addresses from the users array.
 *
 * @return {Array} An array of email addresses.
 */
function getEmailArray() {
  let emails = [];
  users.forEach((user) => emails.push(user.email));
  return emails;
}

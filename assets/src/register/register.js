let isCheckedPrivacyPolicy = false;
let isPasswordVisible = false;
const CHECKBOX_PATH = "../../img/checkbox";
let users = [];

function resetContent() {
  document.createElement("errorPasswordMessage").classList.add("d_none");
}

async function init() {
  let usersResponse = await getItem("users");
  users = JSON.parse(usersResponse.data.value);
}

/**
 * This function changes the image source of the checkbox when the mouse is over the image and simulates the hover effect but only the mouseOver.
 *
 * @param {img element} element
 */
function mouseOver(element) {
  if (isCheckedPrivacyPolicy) {
    changeSrc(element, CHECKBOX_PATH + "_checked_hover.svg");
  } else changeSrc(element, CHECKBOX_PATH + "_hover.svg");
}

/**
 * On mouseout ist this function called to change the source of the image in order to simulate and hover effect of the checkbox.
 * @param {img element} element
 */
function mouseBeside(element) {
  if (isCheckedPrivacyPolicy) element.src = CHECKBOX_PATH + "_checked.svg";
  else element.src = CHECKBOX_PATH + ".svg";
}

/**
 * The function changes the source path of the image element.
 * @param {img element Object} element
 * @param {string} src
 */
function changeSrc(element, src) {
  element.src = src;
}

/**
 * Function used on the checkbox image to toggle the source.
 * @param { img element} checkbox
 */
function togglePrivacyPolicyIcon(checkbox) {
  if (isCheckedPrivacyPolicy) {
    checkbox.src = CHECKBOX_PATH + ".svg";
    isCheckedPrivacyPolicy = false;
  } else {
    checkbox.src = CHECKBOX_PATH + "_checked.svg";
    isCheckedPrivacyPolicy = true;
  }
  checkAllConditions();
}

/**
 * This function toggles the visibility of the password in the password input
 * @param {img element} element
 * @param {string} id
 */
function togglePassword(element, id) {
  let passwordElement = document.getElementById(id);
  if (isPasswordVisible) {
    changeSrc(element, "../../img/visibility_off.svg");
    passwordElement.type = "password";
    isPasswordVisible = false;
  } else {
    changeSrc(element, "../../img/visibility.svg");
    passwordElement.type = "text";
    isPasswordVisible = true;
  }
  checkAllConditions();
}

/**
 * The function reads the form input data and stores it in the remote server and redirects the user to log in.
 */
function register() {
  if (isCheckedPrivacyPolicy) {
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const user = { name, email, password };
    const emails = getEmailArray();
    if (emails.includes(email)) {
      console.log("email already exists");
      getElementWithId('email').style.border = '1px solid red';
    } else {
      console.log("push user on remote storage");
      users.push(user);
      setItem("users", JSON.stringify(users));
    }
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
    confirm.setCustomValidity("");
  } else {
    document.getElementById("errorPasswordMessage").classList.remove("d_none");
  }
  checkAllConditions();
}

function getElementWithId(id) {
  return document.getElementById(id);
}

function checkAllConditions() {
  if (getElementWithId("name").value && getElementWithId("password").value == getElementWithId("confirmPassword").value && getElementWithId("email").value && isCheckedPrivacyPolicy)
    getElementWithId("signUpButton").disabled = false;
  else document.getElementById("signUpButton").disabled = true;
}

function getEmailArray() {
  let emails = [];
  users.forEach((user) => emails.push(user.email));
  return emails;
}

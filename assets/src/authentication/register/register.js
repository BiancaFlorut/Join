let isCheckedPrivacyPolicy = false;
let isPasswordVisible = false;
let users = [];

function resetContent() {
  document.createElement("errorPasswordMessage").classList.add("d_none");
}

function togglePasswordSignUp(element, id) {
  isPasswordVisible = togglePassword(element, id, isPasswordVisible); 
  checkAllConditions();
}

function togglePrivacyPolicyIcon(checkbox) {
  isCheckedPrivacyPolicy = toggleCheckbox(checkbox, isCheckedPrivacyPolicy, CHECKBOX_PATH);
  checkAllConditions();
}

function mouseOverSignUp(element) {
  mouseOver(element, isCheckedPrivacyPolicy);
}

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
    const user = { name, email, password };
    const emails = getEmailArray();
    if (emails.includes(email)) {
      console.log("email already exists");
      getElementWithId('email').style.border = '1px solid rgba(255, 0, 31, 1)';
    } else {
      console.log("push user on remote storage");
      users.push(user);
      await setItemToRemoteStorage("users", JSON.stringify(users));
      getElementWithId('signUpSuccessfullyScreen').classList.remove('d_none');
      setTimeout(function() { window.location.replace('../log_in/log_in.html')}, 1600);
    }
    document.getElementById("signUpButton").disabled = false;
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
    getElementWithId('confirmPassword').style.border = '1px solid #d1d1d1';
    confirm.setCustomValidity("");
  } else {
    document.getElementById("errorPasswordMessage").classList.remove("d_none");
    getElementWithId('confirmPassword').style.border = '1px solid rgba(255, 0, 31, 1)';
  }
  checkAllConditions();
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

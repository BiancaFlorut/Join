let isCheckedPrivacyPolicy = false;
let isPasswordVisible = false;
const CHECKBOX_PATH = "../../img/checkbox";

function resetContent() {
  document.createElement('errorPasswordMessage').classList.add('d_none');
}
/**
 * This function changes the image source of the checkbox when the mouse is over the image and simulates the hover effect but only the mouseOver.
 * 
 * @param {img element} element 
 */
function mouseOver(element) {
  if (isCheckedPrivacyPolicy) {
    changeSrc(element, CHECKBOX_PATH + "_checked_hover.svg");
  } else 
  changeSrc(element, CHECKBOX_PATH + "_hover.svg");
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
}
/**
 * This function toggles the visibility of the password in the password input
 * @param {img element} element 
 * @param {string} id 
 */
function togglePassword(element, id) {
  let passwordElement = document.getElementById(id);
  if (isPasswordVisible) {
    changeSrc(element, '../../img/visibility_off.svg');
    passwordElement.type = 'password';
    isPasswordVisible = false;
  } else {
    changeSrc(element, '../../img/visibility.svg');
    passwordElement.type = 'text';
    isPasswordVisible = true;
  }
}

function register() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (password != confirmPassword) {
    document.getElementById('errorPasswordMessage').classList.remove(d_none);
    console.log('password doesnt match');
  } else {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    let usersResponse = getItem('users');
    console.log(usersResponse);
  }
}
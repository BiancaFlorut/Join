let isCheckedPrivacyPolicy = false;
let isPasswordVisible = false;
const CHECKBOX_PATH = "../../img/checkbox";


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
 * 
 * @param {*} element 
 */
function mouseBeside(element) {
  if (isCheckedPrivacyPolicy) element.src = CHECKBOX_PATH + "_checked.svg";
  else element.src = CHECKBOX_PATH + ".svg";
}

function changeSrc(element, src) {
    element.src = src;
}

function togglePrivacyPolicyIcon(checkbox) {
  if (isCheckedPrivacyPolicy) {
    checkbox.src = CHECKBOX_PATH + ".svg";
    isCheckedPrivacyPolicy = false;
  } else {
    checkbox.src = CHECKBOX_PATH + "_checked.svg";
    isCheckedPrivacyPolicy = true;
  }
}

function changeBackground(element) {
    element.style.backgroundImage = "url('../../img/visibility_off.svg')";
}

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
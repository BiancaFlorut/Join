let CHECKBOX_PATH = '../../img/checkbox';

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
  getElementWithId(id).classList.add("d_none");
}

/**
 * This functions removes the display none class from the element with the id given as parameter.
 * @param {string} id
 */
function showElement(id) {
  getElementWithId(id).classList.remove("d_none");
}

/**
 * The function changes the source path of the image element.
 * @param {HTMLImageElement} element
 * @param {string} src
 */
function changeSrc(element, src) {
  element.src = src;
}

/**
 * This function simulates the behavior of a checkbox by clicking on an img element given hier as a parameter (checkbox) and changes its state as checked or not.
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
 * @param {HTMLImageElement} element
 */
function mouseOver(element, isToggled) {
  if (isToggled) {
    changeSrc(element, CHECKBOX_PATH + "_checked_hover.svg");
  } else changeSrc(element, CHECKBOX_PATH + "_hover.svg");
}

/**
 * On mouseout ist this function called to change the source of the image in order to simulate and hover effect of the checkbox.
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
  let initials = "";
  const names = name.split(" ");
  names.forEach((name) => {
    initials += !(name.charAt(0) == "(") ? name.charAt(0) : "";
  });
  return initials;
}

/**
 * This function check if the string parameter is only whitespace.
 * @param {string} string
 * @returns boolean
 */
function isWhiteSpaceOnly(string) {
  return string.replace(/\s/g, "").length == 0 ? true : false;
}

/**
 * This function generates the html code for the contacts that are assigned to the task given as parameter.
 * @param {Array.<{name: string, email: string, phone: number, color: string}>} contacts
 * @param {} task for which the contacts are assigned to
 * @returns string as html code
 */
function getOptionForAssignedTo(contacts, task) {
  let html = "";
  contacts.forEach((contact) => {
    let checked = "";
      if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
        checked = "_checked";
      }
    let logoHTML = getContactLogoForBigCardEditHTML(contact);
    html += /*html*/ `
        <div class="df_ac big_card_edit_contacts_select" onmousedown="simulateClick(event, this, '${contact.email}', '${checked}')">${logoHTML}<span class="flex_1">${contact.name}</span><img id="${contact.email}Checkbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox"></div >
      `;
  });
  return html;
}

/**
 * This function simulates imperfectly the click event as a workaround to avoid the closing on the drop box wenn the user selects a contact from it.
 * @param {Event} e 
 * @param {HTMLElement} element that triggered the event.
 * @param {string} email of the selected item in the drop down.
 * @param {string} checked flag to toggle the element with the right checkbox image.
 */
function simulateClick(e, element, email, checked) {
  e.preventDefault();
  element.onclick = () => { selectContact(element, email, checked)};
}

/**
 * This function generates the html for the contact given as parameter.
 * @param {name: string, email: string, phone: number, color: string} contact 
 * @returns string
 */
function getContactLogoForBigCardEditHTML(contact) {
  return /*html*/ `
    <div class='contacts_icon big_card_edit_contact_icons' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    `;
}

/**
 * This function toggles the input arrow give as parameter and returns the status of it.
 * @param {HTMLImageElement} imgElement 
 * @param {string} contactsElementId 
 * @returns boolean 
 */
function toggleContactsList(imgElement, contactsElementId, inputId, isContactListOpened) {
  if (isContactListOpened) {
    changeSrc(imgElement, "../../img/arrow_drop_down_down.svg");
    getElementWithId(contactsElementId).classList.add("d_none");
    getElementWithId(inputId).blur();
    return false;
  } else {
    changeSrc(imgElement, "../../img/arrow_drop_down_up.svg");
    getElementWithId(contactsElementId).classList.remove("d_none");
    getElementWithId(inputId).focus();
    return true;
  }
}

/**
 * This function toggles the contact in the drop down select element, where the selected contact is added to the task.
 * @param {HTMLElement} element is the selected item (contact)
 * @param {string} email of the contact 
 * @param {string} checked flag for the checkbox image 
 * @param {JSON} task where to set the assigned to contact
 * @returns the flag for the next select action
 */
function toggleSelectedContact(element, email, checked, task) {
  if (checked == "_checked") {
    toggleCheckbox(getElementWithId(`${email}Checkbox`), true, CHECKBOX_PATH);
    checked = "";
    element.classList.remove("big_card_edit_contact_clicked");
    const index = task.assign_to.findIndex((c) => c.email == email);
    task.assign_to.splice(index, 1);
  } else {
    toggleCheckbox(getElementWithId(`${email}Checkbox`), false, CHECKBOX_PATH + "_white");
    element.classList.add("big_card_edit_contact_clicked");
    let contact = allContacts.find( c => c.email == email);
    task.assign_to.push(contact);
    checked = "_checked";
  }
  return checked;
}

/**
 * This function generates the html code for each contact.
 * @param {Array} contacts to generate the html for 
 * @returns string html as code
 */
function getContactsLogoHTML(contacts) {
  let html = "";
  contacts.forEach((contact) => (html += getContactLogoForBigCardEditHTML(contact)));
  return html;
}

function togglePriority(priorityValue, buttonElement) {
  resetPriorityButtons();
  let classList = getPriorityButtonsClasses(priorityValue).split(" ");
  buttonElement.classList.add(...classList);
}

function resetPriorityButtons() {
  for (let i = 0; i < 3; i++) {
    let classList = getElementWithId("buttonPriority" + i).classList;
    classList.remove("clicked");
    classList.remove(getTaskPriority(i));
  }
}

function getPriorityButtonsClasses(priority) {
  switch (priority) {
    case 0:
      return "low clicked";
    case 1:
      return "medium clicked";
    case 2:
      return "urgent clicked";
    default:
      return "";
  }
}

function getTaskPriority(priority) {
  switch (priority) {
    case 0:
      return "low";
    case 1:
      return "medium";
    case 2:
      return "urgent";
    default:
      break;
  }
}
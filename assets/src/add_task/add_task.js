let addedTask = { assign_to: [], subtasks: [] };
let isContactListOpen = false;
let user;
let allContacts;

// document.addEventListener('DOMContentLoaded', function() {
//   var clearButton = document.getElementById('clearFields');
//   clearButton.addEventListener('click', function() {
//       var inputs = document.querySelectorAll('input, textarea');
//       inputs.forEach(function(input) {
//           input.value = '';
//       });
//   });
// });

// function clearFields() {
//   location.reload();
// }

function clearFields() {

}

/**
 * Initializes the add task functionality.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initAddTask() {
  let container = getElementWithId("addTaskAssignedContacts");
  user = await getUserFromServer(emailParameter);
  const userContact = { name: user.name + " (You)", email: user.email, color: user.color };
  allContacts = [...user.contacts, userContact];
  addedTask.assign_to.push(userContact);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
  container.innerHTML = getOptionForAssignedTo(user.contacts, addedTask, user.email);
  const minDate = new Date().toISOString().split("T")[0];
  getElementWithId("addDueDate").setAttribute("min", minDate);
  togglePriorityTo(1, getElementWithId("buttonPriority1"));
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    istContactListOpen = toggleContactsList(getElementWithId("bigCardEdiSearchIcon"), "addTaskAssignedContacts", "bigCardEdiSearchContact", true);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("addTaskAssignedContacts").innerHTML = getOptionForAssignedTo(allContacts, addedTask, user.email);
  };
  user.categories = [
    { name: "Technical Task", color: "#1FD7C1" },
    { name: "User Story", color: "#0038FF" },
  ];
  showCategoryOptions();
}

/**
 * Sets the toggle for the contact list.
 *
 * @return {undefined} No return value.
 */
function setToggleForTheContactList() {
  const imgElement = getElementWithId("bigCardEdiSearchIcon");
  isContactListOpen = toggleContactsList(imgElement, "addTaskAssignedContacts", "bigCardEdiSearchContact", isContactListOpen);
}

/**
 * Selects a contact and updates the UI accordingly.
 *
 * @param {HTMLDivElement} element - The contact element to be selected.
 * @param {string} email - The email of the contact.
 * @param {string} checked - The checked flag for the checkbox image.
 * @return {void} This function does not return a value.
 */
function selectContact(element, email, checked) {
  checked = toggleSelectedContact(element, email, checked, addedTask);
  const arg1 = "'" + email + "'";
  const arg2 = "'" + checked + "'";
  element.setAttribute("onmousedown", `simulateClick(event, this, ${arg1}, ${arg2})`);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
}

/**
 * Searches for contacts based on the input in the "bigCardEdiSearchContact" element.
 *
 * @return {void} This function does not return a value.
 */
function searchContact() {
  changeSrc(getElementWithId("bigCardEdiSearchIcon"), "../../img/arrow_drop_down_up.svg");
  getElementWithId("addTaskAssignedContacts").classList.remove("d_none");
  isContactListOpen = true;
  const searchToken = getElementWithId("bigCardEdiSearchContact").value;
  const foundContacts = allContacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("addTaskAssignedContacts");
  container.innerHTML = getOptionForAssignedTo(foundContacts, addedTask, user.email);
}

/**
 * Toggles the priority of a task and updates the button style accordingly.
 *
 * @param {number} priorityValue - The new priority value for the task (0 - low, 1 - medium, 2 - urgent).
 * @param {HTMLButtonElement} buttonElement - The button element representing the priority.
 * @return {void} This function does not return a value.
 */
function togglePriorityTo(priorityValue, buttonElement) {
  addedTask.priority = priorityValue;
  togglePriority(priorityValue, buttonElement);
}

/**
 * Confirms the edited subtask input by adding it to the list of subtasks.
 *
 * @return {void} This function does not return a value.
 */
function confirmSubtaskEditInput() {
  let newText = getElementWithId("addSubtasks").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    addedTask.subtasks.push(subtask);
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
  scrollToTheBottomOfTheContainer(getElementWithId("content"));
  // addedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInput();
}

/**
 * Cancels the subtask edit by restoring the original text and removing the edit mode.
 *
 * @param {string} id - The ID of the subtask to cancel the edit for.
 * @return {void} This function does not return a value.
 */
function cancelSubtaskEdit(id) {
  const i = getIndexFromId(id);
  cancelEditSubtask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = addedTask.subtasks[i].text;
  element.blur();
}

/**
 * Saves the edited subtask with the given ID.
 *
 * @param {string} id - The ID of the subtask to be saved.
 * @return {void} This function does not return a value.
 */
function saveEditedSubtask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    addedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskHTML(i);
    element.blur();
  } else deleteEditTaskSubtask(id);
}

/**
 * Deletes a subtask from the "addedTask" object based on the provided ID.
 *
 * @param {string} id - The ID of the subtask to be deleted.
 * @return {void} This function does not return a value.
 */
function deleteEditTaskSubtask(id) {
  const i = getIndexFromId(id);
  addedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
}

/**
 * Generates the HTML code for displaying category options.
 *
 * @return {undefined} This function does not return a value.
 */
function showCategoryOptions() {
  let container = getElementWithId("categoryContainer");
  container.innerHTML = ``;
  user.categories.forEach((category) => {
    container.innerHTML += /*html*/ `
      <div class="category" onclick="selectCategory('${category.name}')">${category.name}</div>
    `;
  });
}

/**
 * Selects a category and updates the addedTask object accordingly.
 *
 * @param {string} name - The name of the category to select.
 * @return {void} This function does not return anything.
 */
function selectCategory(name) {
  addedTask.category = name;
  getElementWithId("addCategory").value = name;
  hideElement("categoryContainer");
}

/**
 * Toggles the visibility of the category options container and changes the source of the arrow icon.
 *
 * @return {void} 
 */
function toggleCategoryOptions() {
  let container = getElementWithId("categoryContainer");
  if (container.classList.contains("d_none")) {
    showElement("categoryContainer");
    changeSrc(getElementWithId("addCategoryIcons").children[0], "../../img/arrow_drop_down_up.svg");
  } else {
    hideElement("categoryContainer");
    changeSrc(getElementWithId("addCategoryIcons").children[0], "../../img/arrow_drop_down_down.svg");
  }
}

/**
 * Enables editing of a category input element by removing the "readonly" attribute,
 * setting focus on the input element, and updating the icons container with three
 * images representing cancel, vertical line, and confirm actions.
 *
 * @param {HTMLInputElement} inputElement - The category input element to be edited.
 * @return {void} This function does not return anything.
 */
function addNewCategory(inputElement) {
  inputElement.removeAttribute("readonly");
  getElementWithId("addCategory").focus();
  getElementWithId("addCategory").value = "";
  let iconsContainer = getElementWithId("addCategoryIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelCategoryEditInput()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmCategoryEditInput()">
    `;
}

/**
 * Cancels the category edit input and resets the icons container and the category input value.
 *
 * @return {undefined} No return value.
 */
function cancelCategoryEditInput() {
  let iconsContainer = getElementWithId("addCategoryIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/arrow_drop_down_down.svg" alt="" onclick="toggleCategoryOptions()">
    `;
  getElementWithId("addCategory").value = "Select task category";
}

/**
 * Confirms the edit input for the category.
 *
 * @return {undefined} No return value.
 */
function confirmCategoryEditInput() {
  const value = getElementWithId("addCategory").value;
  if (!isWhiteSpaceOnly(value)) {
    const newCategory = { name: value, color: selectRandomColor() };
    user.categories.push(newCategory);
    addedTask.category = newCategory;
    showCategoryOptions();
    cancelCategoryEditInput();
    getElementWithId("addCategory").value = value;
  } else cancelCategoryEditInput();
}

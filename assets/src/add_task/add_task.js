let addedTask = { assign_to: [], subtasks: [], status: "toDo" };
let isContactListOpen = false;
let contacts;

/**
 * Adds a new task to the task list for the current user.
 *
 * @return {Promise<void>} A Promise that resolves when the task has been added and the UI has been updated.
 */
async function addNewTask() {
  getElementWithId("createTaskSubmitButton").disabled = true;
  let tasks = await getTaskList(user.email);
  readTaskInfo();
  tasks.push(addedTask);
  await updateTasksFromUser(user.email, tasks);
  await updateContactsAboutTask(addedTask);
  clearFields();
  getElementWithId('toastMessageCreatedTask').style.display = 'flex';
  setTimeout(function() { window.location.replace('../board/board.html?email=' + user.email) }, 2000);
}

/**
 * Reads task information from input fields and assigns it to the addedTask object.
 *
 * @param None
 * @return None
 */
function readTaskInfo() {
  let titleInput = document.getElementById('addTitle');
  addedTask.title = titleInput.value;
  let dueDateInput = document.getElementById('addDueDate');
  addedTask.due_date = dueDateInput.value;
  let categoryInput = document.getElementById('addCategory');
  addedTask.category = categoryInput.value;
  addedTask.description = document.getElementById('addDescription').value;
  addedTask.id = user.email + Date.now();
}

/**
 * Clears the fields in the create task form and resets the addedTask object.
 *
 * @return {void} This function does not return a value.
 */
function clearFields() {
  getElementWithId("createTaskSubmitButton").disabled = true;
  addedTask = { assign_to: [], subtasks: [], status: "toDo" };
  getElementWithId('addTitle').value = '';
  getElementWithId('addDescription').value = '';
  getElementWithId('addDueDate').value = '';
  getElementWithId('addCategory').value = '';
  getElementWithId("createTaskEditSubtasks").innerHTML = '';
  initUserAndGenerateHTML();
}

/**
 * Checks if the required fields in the form are empty and shows corresponding error messages.
 *
 * @return {boolean} Flag indicating if any required field is empty.
 */
function isRequiredFieldsEmpty() {
  let isMissingInput = false;
  let titleInput = document.getElementById('addTitle');
  let dueDateInput = document.getElementById('addDueDate');
  const categoryInput = document.getElementById('addCategory');
  if (isWhiteSpaceOnly(titleInput.value)){
    showElement("createTaskTitleError"); 
    isMissingInput = true;
  } else hideElement("createTaskTitleError");
  if  (dueDateInput.value == ''){
    showElement("createTaskDueDateError");
    isMissingInput = true;
  } else hideElement("createTaskDueDateError");
  if (isWhiteSpaceOnly(categoryInput.value)) {
    showElement("createTaskCategoryError");
    isMissingInput = true;
  } else hideElement("createTaskCategoryError");
  if (!isMissingInput) getElementWithId("createTaskSubmitButton").disabled = false;
  else getElementWithId("createTaskSubmitButton").disabled = true;
  return isMissingInput;
}

/**
 * Initializes the add task functionality.
 */
async function initAddTask() {
  await init();
  initUserAndGenerateHTML();
}

/**
 * Initializes the user and generates the HTML for the add task assigned contacts section.
 *
 * @return {undefined} No return value.
 */
function initUserAndGenerateHTML() {
  let container = getElementWithId("addTaskAssignedContacts");
  const userContact = { name: user.name + " (You)", email: user.email, color: user.color };
  contacts = user.contacts;
  addedTask.assign_to.push(userContact);
  getElementWithId("createTaskAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
  container.innerHTML = getOptionForAssignedToCreateTask(contacts, addedTask, user.email);
  const minDate = new Date().toISOString().split("T")[0];
  getElementWithId("addDueDate").setAttribute("min", minDate);
  togglePriorityTo(1, getElementWithId("buttonPriority1"));
  setAttributes();
  showCategoryOptions();
}

/**
 * Sets attributes for the create task search contact element on double click and blur events.
 *
 * @return {undefined} No return value.
 */
function setAttributes() {
  getElementWithId("createTaskSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("createTaskSearchContact").onblur = function () {
    isContactListOpen = toggleContactsList(getElementWithId("createTaskAssignToIcon"), "addTaskAssignedContacts", "createTaskSearchContact", true);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("addTaskAssignedContacts").innerHTML = getOptionForAssignedToCreateTask(contacts, addedTask, user.email);
  };
}

/**
 * Sets the toggle for the contact list.
 * @return {undefined} No return value.
 */
function setToggleForTheContactListCreateTask() {
  const imgElement = getElementWithId("createTaskAssignToIcon");
  isContactListOpen = toggleContactsList(imgElement, "addTaskAssignedContacts", "createTaskSearchContact", isContactListOpen);
}

/**
 * Selects a contact and updates the UI accordingly.
 * @param {HTMLDivElement} element - The contact element to be selected.
 * @param {string} email - The email of the contact.
 * @param {string} checked - The checked flag for the checkbox image.
 * @return {void} This function does not return a value.
 */
function selectContactCreateTask(element, email, checked) {
  checked = toggleSelectedContact(element, email + "CreateTaskCheckbox", email, checked, addedTask);
  const arg2 = "'" + checked + "'";
  element.setAttribute("onmousedown", `simulateClickCreateTask(event, this, ${email}, ${arg2})`);
  getElementWithId("createTaskAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
}

/**
 * Simulates a click event on a given element.
 *
 * @param {Event} e - The click event.
 * @param {HTMLElement} element - The element to simulate the click on.
 * @param {string} email - The email of the selected item in the drop down.
 * @param {string} checked - The checked flag to toggle the element with the right checkbox image.
 * @return {void} This function does not return a value.
 */
function simulateClickCreateTask(e, element, email, checked) {
  e.preventDefault();
  element.onclick = () => { selectContactCreateTask(element, email, checked)};
}

/**
 * Searches for contacts based on the input in the "createTaskSearchContact" element.
 *
 * @return {void} This function does not return a value.
 */
function searchContact() {
  changeSrc(getElementWithId("createTaskAssignToIcon"), "../../img/arrow_drop_down_up.svg");
  getElementWithId("addTaskAssignedContacts").classList.remove("d_none");
  isContactListOpen = true;
  const searchToken = getElementWithId("createTaskSearchContact").value;
  const foundContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("addTaskAssignedContacts");
  container.innerHTML = getOptionForAssignedToCreateTask(foundContacts, addedTask, user.email);
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
function confirmSubtaskNewInput() {
  let newText = getElementWithId("addSubtasksCreateTask").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    addedTask.subtasks.push(subtask);
  }
  getElementWithId("createTaskEditSubtasks").innerHTML = generateCreateTaskSubTaskListItems(addedTask.subtasks);
  scrollToTheBottomOfTheContainer(getElementWithId("createTask_content"));
  // addedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInputCreateTask();
}

/**
 * Saves the edited subtask with the given ID.
 *
 * @param {string} id - The ID of the subtask to be saved.
 * @return {void} This function does not return a value.
 */
function saveEditedSubtaskCreateTask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    addedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("subtasksIcons_" + i).innerHTML = generateSubtaskHTML(i);
    element.blur();
  } else deleteSubtaskCreateTask(id);
}

/**
 * Cancels the edit mode for a subtask element in the create task section.
 *
 * @param {string} id - The ID of the subtask element.
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return a value.
 */
function cancelEditSubtaskCreateTask(id, i) {
  let element = getElementWithId(id);
  element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
  element.contentEditable = false;
  getElementWithId("subtasksIcons_" + i).classList.add("d_none");
  getElementWithId("subtasksIcons_" + i).innerHTML = generateSubtaskHTML(i);
}

/**
 * Sets the onblur function for an edited subtask element.
 *
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return a value.
 */
function setOnBlurFunctionOnEditedSubtask(i) {
  const subtaskELementId = `createTaskSubtaskText_${i}`;
  let element = getElementWithId(subtaskELementId);
  const iconsId = `subtasksIcons_${i}`;
  element.onblur = function () {
    element.onmouseout = hideElement(iconsId);
    getElementWithId(iconsId).classList.add('d_none');
    cancelSubtaskEdit(subtaskELementId);
  };
}

/**
 * Deletes a subtask from the "addedTask" object based on the provided ID.
 *
 * @param {string} id - The ID of the subtask to be deleted.
 * @return {void} This function does not return a value.
 */
function deleteSubtaskCreateTask(id) {
  const i = getIndexFromId(id);
  addedTask.subtasks.splice(i, 1);
  getElementWithId("createTaskEditSubtasks").innerHTML = generateCreateTaskSubTaskListItems(addedTask.subtasks);
}

/**
 * Selects a category and updates the addedTask object accordingly.
 *
 * @param {string} name - The name of the category to select.
 * @return {void} This function does not return anything.
 */
function selectCategory(name) {
  showCategoryOptions();
  getElementWithId(`${name}`).classList.add("category_selected");
  addedTask.category = name;
  getElementWithId("addCategory").value = name;
  getElementWithId("addCategory").onchange();
  setTimeout(() => {toggleCategoryOptions();}, 200);
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
 * Confirms the edited category input value and updates the user's categories.
 *
 * @return {Promise<void>} - A promise that resolves when the category is confirmed and updated.
 */
async function confirmCategoryEditInput() {
  const value = getElementWithId("addCategory").value;
  if (!isWhiteSpaceOnly(value)) {
    const newCategory = { name: value, color: selectRandomColor() };
    user.categories.push(newCategory);
    console.log(user);
    await updateUserToRemoteServer(user);
    addedTask.category = newCategory;
    showCategoryOptions();
    getElementWithId("addCategory").value = value;
  }  
  cancelCategoryEditInput();
}
let addedTask = { assign_to: [], subtasks: [], status: "toDo" };
let isContactListOpen = false;
let contacts;

async function addNewTask() {
  console.log("Creating a task: ", addedTask);
  getElementWithId("createTaskSubmitButton").disabled = true;
  let tasks = await getTaskList(user.email);
  let titleInput = document.getElementById('addTitle');
  addedTask.title = titleInput.value;
  let dueDateInput = document.getElementById('addDueDate');
  addedTask.due_date = dueDateInput.value;
  let categoryInput = document.getElementById('addCategory');
  addedTask.category = categoryInput.value;
  addedTask.description = document.getElementById('addDescription').value;
  addedTask.id = user.email + Date.now();
  tasks.push(addedTask);
  await updateTasksFromUser(user.email, tasks);
  await updateContactsAboutTask(addedTask);
  clearFields();
  getElementWithId('toastMessageCreatedTask').style.display = 'flex';
  setTimeout(function() { window.location.replace('../board/board.html?email=' + user.email) }, 2000);
}

function clearFields() {
  getElementWithId("createTaskSubmitButton").disabled = true;
  addedTask = { assign_to: [], subtasks: [], status: "toDo" };
  getElementWithId('addTitle').value = '';
  getElementWithId('addDescription').value = '';
  getElementWithId('addDueDate').value = '';
  getElementWithId('addCategory').value = '';
  getElementWithId("bigCardEditSubtasks").innerHTML = '';
  initUserAndGenerateHTML();
}

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

function getOptionForAssignedToCreateTask(contacts, task, exceptUserEmail) {
  let html = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  contacts.forEach((contact) => {
    if (contact.email != exceptUserEmail){
      let checked = "";
      if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
        checked = "_checked";
      }
    let logoHTML = getContactLogoForBigCardEditHTML(contact);
    html += /*html*/ `
        <div class="df_ac big_card_edit_contacts_select cursor_pointer" onmousedown="simulateClickCreateTask(event, this, '${contact.email}', '${checked}')">${logoHTML}<span class="flex_1">${contact.name}</span><img id="${contact.email}CreateTaskCheckbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox"></div >
      `;
    }
  });
  return html;
}

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
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
  scrollToTheBottomOfTheContainer(getElementWithId("createTask_content"));
  // addedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInputCreateTask();
}

/**
 * This function cancels the edit mode for the subtask input and sets blur function.
 */
function cancelSubtaskEditInputCreateTask() {
  let iconsContainer = getElementWithId("createTaskSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img id="createTaskAddNewSubtaskIcon" class="visibility_icon" src="../../img/plus.svg" alt="" onclick="toggleCreateTasksSubtasks()"/>
    `;
  getElementWithId("addSubtasksCreateTask").value = "";
  getElementWithId("addSubtasksCreateTask").onblur = function () {
    let iconsContainer = getElementWithId("createTaskSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `
        <img id="createTaskAddNewSubtaskIcon" class="visibility_icon" src="../../img/plus.svg" alt="" onclick="toggleCreateTasksSubtasks()"/>
    `;
    getElementWithId("addSubtasksCreateTask").value = "";
  };
  getElementWithId("addSubtasksCreateTask").blur();
}

/**
 * Cancels the subtask edit by restoring the original text and removing the edit mode.
 *
 * @param {string} id - The ID of the subtask to cancel the edit for.
 * @return {void} This function does not return a value.
 */
function cancelSubtaskEditCreateTask(id) {
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
function saveEditedSubtaskCreateTask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    addedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskHTML(i);
    element.blur();
  } else deleteSubtaskCreateTask(id);
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
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
}

function createSubtaskCreateTask(id) {
  let element = getElementWithId(id);
  const i = getIndexFromId(id);
  element.parentElement.classList.add("big_card_edit_subtask_on_edit");
  element.contentEditable = true;
  element.focus();
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
        <img src="../../img/delete.svg" alt="" onclick="cancelSubtaskEditCreateTask('${id}', ${i})">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="saveEditedSubtaskCreateTask('${element.id}')">
    `;
  getElementWithId(id).onmouseout = `showElement('bigCardEditCardIcons_${i}')`;
}


function showCategoryOptions() {
  let container = getElementWithId("categoryContainer");
  container.innerHTML = ``;
  user.categories.forEach((category) => {
    container.innerHTML += /*html*/ `
      <div id="${category.name}" class="category" onclick="selectCategory('${category.name}')">${category.name}</div>
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
  getElementWithId("addCategory").value = "";
}


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

/**
 * This function clears the blur event handler for the "addSubtasksCreateTask" element,
 * and replaces the icons in "createTaskSubtaskInputIcons" container with edit mode icons. 
 * The input is focused and the user can type the new subtask.
 * @returns {void}
 */
function toggleCreateTasksSubtasks() {
  getElementWithId("addSubtasksCreateTask").onblur = "";
  getElementWithId("addSubtasksCreateTask").focus();
  let iconsContainer = getElementWithId("createTaskSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelSubtaskEditInputCreateTask()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmSubtaskNewInput()">
    `;
}

/**
 * This function generates the html code with the edit icons for each subtask.
 * @param {Array} subtasks 
 * @returns string html
 */
function generateSubTaskListItems(subtasks) {
  let html = "";
  subtasks.forEach((subtask, i) => {
    html += /*html*/ `
        <li>
            <div class="df_ac big_card_edit_subtask" onmouseover='showElement("bigCardEditCardIcons_${i}")' onmouseout="hideElement('bigCardEditCardIcons_${i}')">
            <span class="list_bullet">&bull;</span>    
            <span id="bigCardEditCardSubtaskText_${i}" ondblclick="createSubtaskCreateTask('bigCardEditCardSubtaskText_${i}')" class="flex_1">${subtask.text}</span>
                <div id="bigCardEditCardIcons_${i}" class="df_ac big_card_edit_subtask_icons d_none">`
                   + generateSubtaskHTML(i) + /*html*/ `
                </div>
            </div>
        </li>
        `;
  });
  return html;
}

function generateSubtaskHTML(i) {
  return /*html*/ `
  <img src="../../img/edit.svg" alt="" onclick="createSubtaskCreateTask('bigCardEditCardSubtaskText_${i}')">
  <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
  <img src="../../img/delete.svg" alt="" onclick="deleteSubtaskCreateTask('bigCardEditCardSubtaskText_${i}')">
  `;
}
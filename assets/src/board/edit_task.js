let editedTask;
let istContactListOpen = false;

/**
 * Edits a task with the given taskId.
 *
 * @param {number} taskId - The id of the task to edit.
 * @return {undefined} This function does not return a value.
 */
function editTask(taskId) {
  let container = getElementWithId("bigCardContent");
  editedTask = structuredClone(tasks.find((t) => t.id == taskId));
  const priorityClass = getPriorityButtonsClasses(editedTask.priority);
  const due_date = new Date(editedTask.due_date);
  const valueDate = due_date.toISOString().split("T")[0];
  const minDateValue = new Date().toISOString().split("T")[0];
  let priorityClasses = ["", "", ""];
  priorityClasses[editedTask.priority] = priorityClass;
  container.innerHTML = generateEditedTaskHTML(valueDate, minDateValue, priorityClasses);
  initEvents();
}

/**
 * Initializes events for interacting with the UI elements.
 */
function initEvents() {
  // editedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    istContactListOpen = toggleContactsList(getElementWithId("bigCardEdiSearchIcon"), "bigCardEditContacts", 'bigCardEdiSearchContact', true);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("bigCardEditContacts").innerHTML = getOptionForAssignedTo(user.contacts, editedTask, user.email);
  };
  getElementWithId("addSubtasksEditTask").onblur = function () {
    let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `<img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />`;
    getElementWithId("addSubtasksEditTask").value = "";
  };
}

/**
 * This function generates the html code for the contacts that are assigned to the task given as parameter.
 * @param {Array.<{name: string, email: string, phone: number, color: string}>} contacts
 * @param {} task for which the contacts are assigned to
 * @returns string as html code
 */
function getOptionForAssignedTo(contacts, task, exceptUserEmail) {
  let html = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  contacts.forEach((contact) => {
    if (contact.email != exceptUserEmail){
      let checked = "";
      let selected = "";
      if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
        checked = "_white_checked";
        selected = "big_card_edit_contact_clicked";
      }
    let logoHTML = getContactLogoForBigCardEditHTML(contact);
    html += /*html*/ `
        <div class="df_ac big_card_edit_contacts_select cursor_pointer ${selected}" onmousedown="simulateClick(event, this, '${contact.email}', '${checked}')">
          ${logoHTML}
          <span class="flex_1">${contact.name}</span>
          <img id="${contact.email}Checkbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox">
        </div >
      `;
    }
  });
  return html;
}


/**
 * Saves the edited task by disabling the "bigCardEditOkButton", updating the contacts about the task, 
 * enabling the "bigCardEditOkButton" again, closing the big card view, and initializing the board.
 *
 * @return {Promise<void>} A promise that resolves when the task has been saved and the board has been initialized.
 */
async function saveEditedTask() {
  getElementWithId('bigCardEditOkButton').disabled = true;
  let oldTask = user.tasks.find((t) => t.id == editedTask.id);
  const contactsOut = oldTask.assign_to.filter((contact) => !editedTask.assign_to.some((assignToContact) => assignToContact.email == contact.email));
  deleteTaskFromAssignedToUsers(contactsOut, editedTask.id);
  await updateContactsAboutTask(editedTask);
  getElementWithId('bigCardEditOkButton').disabled = false;
  closeBigCardView();
  initBoard();
}

/**
 * Validates the due date input for the edited task.
 *
 * @return {boolean} Returns true if the due date is valid, false otherwise.
 */
function isDueDateValid() {
  let dueDate = getElementWithId("editedTaskDueDateInput").value;
  if (!dueDate) {
    showElement("editedTaskDueDateInputError");
    return false;
  } else {
    hideElement("editedTaskDueDateInputError");
    editedTask.due_date = dueDate;
    return true;
  }
}

/**
 * Validates the description input for the edited task.
 *
 * @return {boolean} Returns true if the description is valid (not whitespace only), false otherwise.
 */
function isDescriptionValid() {
  let description = getElementWithId("editedTaskDescriptionInput").value;
  if (!isWhiteSpaceOnly(description)) {
    editedTask.description = description;
    hideElement("editedTaskDescriptionInputError");
    return true;
  } else {
    showElement("editedTaskDescriptionInputError");
    return false;
  }
}

/**
 * Validates the title input for the edited task.
 *
 * @return {boolean} Returns true if the title is valid, false otherwise.
 */
function isTitelValid() {
  let title = getElementWithId("editedTaskTitleInput").value;
  if (!isWhiteSpaceOnly(title)) {
    editedTask.title = title;
    hideElement("editedTaskTitleInputError");
    return true;
  } else {
    showElement("editedTaskTitleInputError");
    return false;
  }
}

/**
 * Confirms the edited subtask input by adding it to the list of subtasks.
 *
 * @return {void} This function does not return a value.
 */
function confirmSubtaskEditInput() {
  let newText = getElementWithId("addSubtasksEditTask").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    editedTask.subtasks.push(subtask);
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
  scrollToTheBottomOfTheContainer(document.getElementsByClassName('big_card_edit_content_area')[0]);
  // editedTask.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInput();
}

/**
 * This function clears the blur event handler for the "addSubtasksEditTask" element,
 * and replaces the icons in "bigCardEditSubtaskInputIcons" container with edit mode icons. 
 * The input is focused and the user can type the new subtask.
 * @returns {void}
 */
function toggleEditTasksSubtasks() {
  getElementWithId("addSubtasksEditTask").onblur = "";
  getElementWithId("addSubtasksEditTask").focus();
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelSubtaskEditInput()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmSubtaskEditInput()">
    `;
}


/**
 * Cancels the edit mode for the subtask input and sets blur function.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function cancelSubtaskEditInput() {
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" onclick="toggleEditTasksSubtasks()"/>
    `;
  getElementWithId("addSubtasksEditTask").value = "";
  getElementWithId("addSubtasksEditTask").onblur = function () {
    let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `
        <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />
    `;
    getElementWithId("addSubtasksEditTask").value = "";
  };
  getElementWithId("addSubtasksEditTask").blur();
}

/**
 * Deletes an edited subtask from the editedTask object based on the provided ID.
 *
 * @param {string} id - The ID of the subtask to be deleted.
 * @return {void} This function does not return a value.
 */
function deleteEditTaskSubtask(id) {
  const i = getIndexFromId(id);
  editedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
}

/**
 * Cancels the edit mode for a subtask element and restores the original text.
 *
 * @param {string} id - The ID of the subtask element.
 * @return {void} This function does not return a value.
 */
function cancelSubtaskEditEditTask(id) {
  const i = getIndexFromId(id);
  cancelEditSubtask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = editedTask.subtasks[i].text;
  element.blur();
}

/**
 * Saves the edited subtask with the given ID.
 *
 * @param {string} id - The ID of the subtask to be saved.
 * @return {void} This function does not return a value.
 */
function saveEditedSubtaskEditTask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    editedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskEditIconsHTML(i);
    element.blur();
  } else deleteEditTaskSubtask(id);
}

/**
 * Searches for contacts based on the input in the "bigCardEdiSearchContact" element.
 *
 * @return {void} This function does not return a value.
 */
function searchContact() {
  changeSrc(getElementWithId("bigCardEdiSearchIcon"), "../../img/arrow_drop_down_up.svg");
  getElementWithId("bigCardEditContacts").classList.remove("d_none");
  istContactListOpen = true;
  const searchToken = getElementWithId("bigCardEdiSearchContact").value;
  const foundContacts = allContacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("bigCardEditContacts");
  container.innerHTML = getOptionForAssignedTo(foundContacts, editedTask, user.email);
}

/**
 * Toggles the priority of a task and updates the button style accordingly.
 *
 * @param {number} priorityValue - The new priority value for the task (0 - low, 1 - medium, 2 - urgent).
 * @param {HTMLButtonElement} buttonElement - The button element representing the priority.
 * @return {void} This function does not return a value.
 */
function togglePriorityToEditedTask(priorityValue, buttonElement) {
  editedTask.priority = priorityValue;
  togglePriority(priorityValue, buttonElement);
}

/**
 * Toggles the contact list visibility based on the state of istContactListOpen.
 *
 * @return {undefined} No return value.
 */
function setToggleForTheContactList() {
  const imgElement = getElementWithId('bigCardEdiSearchIcon');
  istContactListOpen = toggleContactsList(imgElement, 'bigCardEditContacts', 'bigCardEdiSearchContact', istContactListOpen);
  if (istContactListOpen) scrollToTheBottomOfTheContainer(getElementWithId('editedTaskContainer'));
}

/**
 * This function selects an contact and add it in the editTask.assigned_to toggles the look and the checkbox
 * @param {HTMLDivElement} element
 * @param {string} email
 * @param {string} checked
 */
function selectContact(element, email, checked) {
  if (checked == '_white_checked') checked ='_checked';
  const arg1 = "'" + email + "'";
  checked = toggleSelectedContact(element, email + "Checkbox",email, checked, editedTask);
  const arg2 = "'" + checked + "'";
  element.setAttribute("onmousedown", `simulateClick(event ,this, ${arg1}, ${arg2})`);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(editedTask.assign_to);
}

/**
 * This function return the according string name for the path source of the icon.
 * @param {number} priority  0 - low, 1 - medium, 2 - urgent  .
 * @returns string name for the priority source path.
 */
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


/**
 * This function enables edit mode for a subtask by adding a class to its parent element,
 * setting its contentEditable property to true, and focusing on it. It also replaces the icons
 * in the subtask's icons container with cancel and confirm icons. The function also
 * sets an onmouseout event listener to show the icons container.
 *
 * @param {string} id - The id of the subtask element.
 * @return {void} This function does not return anything.
 */
function editTasksSubtask(id) {
  let element = getElementWithId(id);
  const i = getIndexFromId(id);
  element.parentElement.classList.add("big_card_edit_subtask_on_edit");
  element.contentEditable = true;
  element.focus();
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
        <img src="../../img/delete.svg" alt="" onclick="cancelSubtaskEditEditTask('${id}', ${i})">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="saveEditedSubtaskEditTask('${element.id}')">
    `;
  getElementWithId(id).onmouseout = `showElement('bigCardEditCardIcons_${i}')`;
}

/**
 * Cancels the edit mode for a subtask element.
 *
 * @param {string} id - The ID of the subtask element.
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return a value.
 */
function cancelEditSubtask(id, i) {
  let element = getElementWithId(id);
  element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
  element.contentEditable = false;
  getElementWithId("bigCardEditCardIcons_" + i).classList.add("d_none");
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskHTML(i);
}

/**
 * Sets the onblur function for an edited subtask element.
 *
 * @param {number} i - The index of the subtask.
 */
function setOnBlurFunctionOnEditedSubtask(i) {
  const subtaskELementId = `bigCardEditCardSubtaskText_${i}`;
  let element = getElementWithId(subtaskELementId);
  const iconsId = `bigCardEditCardIcons_${i}`;
  element.onblur = function () {
    element.onmouseout = hideElement(iconsId);
    getElementWithId(iconsId).classList.add('d_none');
    cancelSubtaskEdit(subtaskELementId);
  };
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
            <span id="bigCardEditCardSubtaskText_${i}" ondblclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}')" class="flex_1">${subtask.text}</span>
                <div id="bigCardEditCardIcons_${i}" class="df_ac big_card_edit_subtask_icons d_none">`
                   + generateSubtaskEditIconsHTML(i) + /*html*/ `
                </div>
            </div>
        </li>
        `;
  });
  return html;
}

/**
 * Generates the HTML code for the edit icons of a subtask.
 *
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML code for the edit icons.
 */
function generateSubtaskEditIconsHTML(i) {
  return /*html*/ `
  <img src="../../img/edit.svg" alt="" onclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}')">
  <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
  <img src="../../img/delete.svg" alt="" onclick="deleteEditTaskSubtask('bigCardEditCardSubtaskText_${i}')">
  `;
}

/**
 * Deletes a task from the tasks array and updates the board.
 *
 * @param {string} id - The ID of the task to be deleted.
 * @return {Promise<void>} A promise that resolves when the task is deleted and the board is updated.
 */
async function deleteTask(id) {
  const index = tasks.findIndex(task => task.id == id);
  const task = tasks[index];
  await deleteTaskFromAssignedToUsers(task.assign_to, id);
  closeBigCardView()
  await initBoard();
}
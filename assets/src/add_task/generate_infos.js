/**
 * Generates HTML for assigning contacts to a task, excluding a specific user.
 *
 * @param {Array} contacts - The list of contacts to display.
 * @param {Object} task - The task object to which contacts are assigned.
 * @param {string} exceptUserEmail - The email of the user to exclude from assignment.
 * @return {string} The generated HTML for assigning contacts to the task.
 */
function getOptionForAssignedToCreateTask(contacts, task, exceptUserEmail) {
  let html = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  contacts.forEach((contact) => {
    if (contact.email != exceptUserEmail) {
      let checked = "";
      let selected = "";
      if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
        checked = "_white_checked";
        selected = "big_card_edit_contact_clicked";
      }
      let logoHTML = getContactLogoForBigCardEditHTML(contact);
      html += /*html*/ `
          <div class="df_ac big_card_edit_contacts_select cursor_pointer ${selected}" onmousedown="simulateClickCreateTask(event, this, '${contact.email}', '${checked}')">
            ${logoHTML}
            <span class="flex_1">${contact.name}</span>
            <img id="${contact.email}CreateTaskCheckbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox">
          </div>
        `;
    }
  });
  return html;
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
  cancelEditSubtaskCreateTask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = addedTask.subtasks[i].text;
  element.blur();
}

/**
 * Creates a subtask in the create task section by adding the necessary HTML elements and event listeners.
 *
 * @param {string} id - The ID of the subtask element.
 * @return {void} This function does not return a value.
 */
function createSubtaskCreateTask(id) {
  let element = getElementWithId(id);
  const i = getIndexFromId(id);
  element.parentElement.classList.add("big_card_edit_subtask_on_edit");
  element.contentEditable = true;
  element.focus();
  getElementWithId("subtasksIcons_" + i).innerHTML = /*html*/ `
          <img src="../../img/delete.svg" alt="" onclick="cancelSubtaskEditCreateTask('${id}', ${i})">
          <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
          <img src="../../img/confirm.svg" alt="" onclick="saveEditedSubtaskCreateTask('${element.id}')">
      `;
  getElementWithId(id).onmouseout = `showElement('subtasksIcons_${i}')`;
}

/**
 * Generates the HTML for displaying category options and appends them to the category container.
 *
 * @return {void} This function does not return a value.
 */
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
function generateCreateTaskSubTaskListItems(subtasks) {
  let html = "";
  subtasks.forEach((subtask, i) => {
    html +=
      /*html*/ `
          <li>
              <div class="df_ac big_card_edit_subtask" onmouseover='showElement("subtasksIcons_${i}")' onmouseout="hideElement('subtasksIcons_${i}')">
              <span class="list_bullet">&bull;</span>    
              <span id="createTaskSubtaskText_${i}" ondblclick="createSubtaskCreateTask('createTaskSubtaskText_${i}')" class="flex_1">${subtask.text}</span>
                  <div id="subtasksIcons_${i}" class="df_ac big_card_edit_subtask_icons d_none">` +
      generateSubtaskHTML(i) +
      /*html*/ `
                  </div>
              </div>
          </li>
          `;
  });
  return html;
}

/**
 * Generates the HTML code for the subtask edit icons.
 *
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML code for the subtask edit icons.
 */
function generateSubtaskHTML(i) {
  return /*html*/ `
    <img src="../../img/edit.svg" alt="" onclick="createSubtaskCreateTask('createTaskSubtaskText_${i}')">
    <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
    <img src="../../img/delete.svg" alt="" onclick="deleteSubtaskCreateTask('createTaskSubtaskText_${i}')">
    `;
}

/**
 * Opens a task and displays its details in the big card view.
 *
 * @param {string} id - The ID of the task to open.
 * @return {void} This function does not return anything.
 */
function openTask(id) {
  showElement("bigCardView");
  let container = getElementWithId("bigCardContent");
  const task = tasks.find((t) => t.id == id);
  const d = new Date(task.due_date);
  const dueDate = formateDate(d);
  const priority = getTaskPriority(task.priority);
  container.innerHTML =
    /*html*/ `
      <div class="big_card_header">
        <div class='big_card_category ${getCategoryClassColor(task.category)}'>${task.category}</div>
        <div class="close_icon" onclick="closeBigCardView()">
          <img src="../../img/close_black.svg" alt="close">
        </div>
      </div>
      <div class="big_card_scrollable_wrapper">
      <h1>${task.title}</h1>
      <span>${task.description}</span>
      <div>
        <span class="big_card_title">Due Date:</span>
        <span>${dueDate}</span>
      </div>
      <div class='df_ac'>
        <span class="big_card_title">Priority:</span>
        <div class='priority_area' >
          <span class="pr_10" style="text-transform: capitalize;">${priority}</span>
          <img src="../../img/priority_${priority}.svg" alt="">
        </div>
      </div>
      <div class="big_card_assigned_to_area">
        <span class="big_card_title">Assigned To:</span>
        <div class="big_card_assigned_to_list">` +
    getAssignedToHTML(task.assign_to) +
    /*html*/ `
        </div>
      </div>
      <div class="big_card_assigned_to_area">
        <span class="big_card_title">Subtasks</span>
        <div class="big_card_assigned_to_list">` +
    getSubTaskForBigCardHTML(task) +
    /*html*/ `
        </div>
      </div>
      </div>
      
      <div class='big_card_footer df_ac'>
        <div class='big_card_change df_ac' onclick="deleteTask('${task.id}')" onmouseover="changeIdImgTheSrc('deleteIcon', '../../img/delete_blue.svg')" onmouseout="changeIdImgTheSrc('deleteIcon', '../../img/delete.svg')">
          <img id="deleteIcon" src="../../img/delete.svg" alt="delete">
          <span>Delete</span>
        </div>
        <img src="../../img/input_vertical_line.svg" alt="">
        <div class='big_card_change df_ac' onclick="editTask('${task.id}')" onmouseover="changeIdImgTheSrc('editIcon', '../../img/edit_blue.svg')" onmouseout="changeIdImgTheSrc('editIcon', '../../img/edit.svg')">
          <img id="editIcon" src="../../img/edit.svg" alt="edit">
          <span>Edit</span>
        </div>
      </div>
    `;
}

/**
 * Formats a given date into a string representation of the format "dd/mm/yyyy".
 *
 * @param {Date} date - The date to be formatted.
 * @return {string} The formatted date string.
 */
function formateDate(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return dd + "/" + mm + "/" + yyyy;
}

/**
 * Generates the HTML code for the subtasks of a big card.
 *
 * @param {Object} task - The task object containing subtasks.
 * @return {string} The HTML code for the subtasks of the big card.
 */
function getSubTaskForBigCardHTML(task) {
  let subtasks = task.subtasks;
  let html = "";
  subtasks.forEach(function (subtask, index) {
    const checkbox = subtask.checked ? SUBTASK_CHECKBOX_PATH + "_checked.svg" : SUBTASK_CHECKBOX_PATH + ".svg";
    html += /*html*/ `
        <div class="big_card_subtask_area df_ac">
          <img src="${checkbox}" alt="checkbox" onclick="toggleSubtaskCheckbox(this, '${task.id}', ${index})">
          <span>${subtask.text}</span>
        </div>`;
  });
  return html;
}

/**
 * Generates the HTML code for the assigned contacts in a big card.
 *
 * @param {Array} array - An array of contact objects.
 * @return {string} The HTML code for the assigned contacts.
 */
function getAssignedToHTML(array) {
  let html = "";
  array.forEach((contact) => (html += getContactForBigCardHTML(contact)));
  return html;
}

/**
 * Generates the HTML code for the big card assigned to a contact including the contact logo and name.
 *
 * @param {Object} contact - The contact object.
 * @return {string} The HTML code for the big card assigned to the contact.
 */
function getContactForBigCardHTML(contact) {
  let you = contact.name == user.name ? " (You)" : "";
  return (
    /*html*/ `
      <div class='big_card_assigned_to'>` +
    getContactLogoHTML(contact) +
    /*html*/ `  
        <div>${contact.name + you}</div>
      </div>
    `
  );
}

/**
 * Generates the HTML code for the contact logo.
 *
 * @param {Object} contact - The contact object.
 * @return {string} The HTML code for the contact logo.
 */
function getContactLogoHTML(contact) {
  return /*html*/ `
      <div class='contacts_icon' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    `;
}

/**
 * Closes the big card view and resets the edited task.
 *
 * @return {void} This function does not return a value.
 */
function closeBigCardView() {
  editedTask = {};
  hideElement("bigCardView");
}

/**
 * Closes the create task view and clears the input fields.
 *
 * @return {void} This function does not return a value.
 */
function closeCreateTask() {
  hideElement("createTask");
  clearFields()
}

/**
 * Changes the source of an image element with the specified ID.
 *
 * @param {string} id - The ID of the image element to change the source.
 * @param {string} src - The new source to set for the image element.
 * @return {void} This function does not return a value.
 */
function changeIdImgTheSrc(id, src) {
  changeSrc(getElementWithId(id), src);
}

/**
 * Toggles the checkbox of a subtask and updates the task and contacts accordingly.
 *
 * @param {HTMLElement} element - The checkbox element that was clicked.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} i - The index of the subtask in the task's subtasks array.
 */
function toggleSubtaskCheckbox(element, taskId, i) {
  let taskIndex = tasks.findIndex((t) => t.id == taskId);
  let task = tasks.find((t, index) => t.id == taskId);
  let isChecked = task.subtasks[i].checked;
  tasks[taskIndex].subtasks[i].checked = toggleCheckbox(element, isChecked, SUBTASK_CHECKBOX_PATH);
  //change the task for the assigned to contacts.
  updateTasksFromUser(emailParameter, tasks);
  updateContactsAboutTask(tasks[taskIndex]);
  updateHTML(tasks);
}
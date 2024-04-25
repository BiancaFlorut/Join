let tasks = [];
const SUBTASK_CHECKBOX_PATH = "../../img/checkbox_board";
let cols = ["toDo", "inProgress", "awaitFeedback", "done"];

let currentDraggedElement;


/**
 * Filters the tasks array based on their status and returns an array of objects
 * with the name and cards properties.
 *
 * @param {Array} array - The array of tasks to be filtered.
 * @return {Array} An array of objects with the name and cards properties.
 */
function resetColumns(array) {
  const toDo = array.filter((t) => t["status"] == "toDo" || !t.status);
  const inProgress = array.filter((t) => t.status == "inProgress");
  const awaitFeedback = array.filter((t) => t.status == "awaitFeedback");
  const done = array.filter((t) => t["status"] == "done");
  return (columns = [
    { name: "toDo", cards: toDo },
    { name: "inProgress", cards: inProgress },
    { name: "awaitFeedback", cards: awaitFeedback },
    { name: "done", cards: done },
  ]);
}

/**
 * Returns an HTML string representing a div element with the class "no_tasks_to_do"
 * and the text "No tasks To do".
 *
 * @return {string} An HTML string representing a div element.
 */
function getNoTasksToDoHTML() {
  return /*html*/ `
    <div class="no_tasks_to_do">No tasks To do</div>
  `;
}

/**
 * Initializes the board by fetching user data from the server and updating the tasks, HTML, and all contacts.
 *
 * @return {Promise<void>} A promise that resolves when the board has been initialized.
 */
async function initBoard() {
  user = await getUserFromServer(emailParameter);
  tasks = user.tasks;
  const userContact = { name: user.name + " (You)", email: user.email, color: user.color };
  updateHTML(tasks);
  allContacts = [...user.contacts, userContact];
}


/**
 * Updates the HTML for all the tasks.
 *
 * @param {Array} array - The array of tasks.
 */
function updateHTML(array) {
  const columns = resetColumns(array);
  columns.forEach((column) => {
    document.getElementById(`${column.name}`).innerHTML = "";
    if (column.cards.length > 0) {
      column.cards.forEach((card) => (document.getElementById(`${column.name}`).innerHTML += generateSmallTaskHTML(card)));
      getElementWithId(`${column.name}`).classList.remove('flex_column');
    } else {
      document.getElementById(`${column.name}`).innerHTML = getNoTasksToDoHTML();
      getElementWithId(`${column.name}`).classList.add('flex_column');
    }
    document.getElementById(`${column.name}`).innerHTML += generateHighlightedCardGhostHTML(column.name);
  });
}

/**
 * Starts the dragging process for the specified element.
 *
 * @param {string} id - The ID of the element to start dragging.
 * @return {void} This function does not return a value.
 */
function startDragging(id) {
  currentDraggedElement = id;
  getElementWithId(id).classList.add("drag_highlight");
}

/**
 * Generates the HTML structure for a highlighted card ghost based on the column name.
 *
 * @param {string} columnName - The name of the column for which the ghost card is generated.
 * @return {string} The HTML string representing the highlighted card ghost.
 */
function generateHighlightedCardGhostHTML(columnName) {
  return /*html*/ `
  <div id="${columnName}Ghost" class="card_small card_small_ghost"></div>
    
  `;
}

/**
 * Generates the HTML structure for a small task card based on the task object.
 *
 * @param {object} task - The task object containing information about the task.
 * @return {string} The HTML string representing the small task card.
 */
function generateSmallTaskHTML(task) {
  const category = task.category;
  let categoryColor = user.categories.find((c) => c.name == category);
  if (!categoryColor) {
    categoryColor = { name: category, color: selectRandomColor() };
    user.categories.push(categoryColor);
    updateUserToRemoteServer(user);
  }
  let subtasksHTML = "";
  if (task.subtasks.length > 0) subtasksHTML = getSubTaskHTML(task);
  const priorityString = getTaskPriority(task.priority);
  return (
    /*html*/ `
    <div id="${task.id}" draggable="true" ondragstart="startDragging('${task.id}')" class="card_small" onclick="openTask('${task.id}')">
      <div class="task_category" style="background-color: ${categoryColor.color}">${task.category}</div>
      <div class="task_text_area">
        <div class="task_header">${task["title"]}</div>
        <div class="task_description">${task.description}</div>
      </div>` +
    subtasksHTML +
    /*html*/ `
      <div class='small_card_footer'>
        <div class="small_card_users_area df_ac">` +
    getAssignedToIconsHTML(task.assign_to) +
    /*html*/ `
          <div class="small_task_priority"><img src="../../img/priority_${priorityString}.svg" alt=""></div>
        </div>
      </div>
    </div>`
  );
}

/**
 * Returns the CSS class name for the background color of a category.
 *
 * @param {string} category - The name of the category.
 * @return {string} The CSS class name for the background color of the category.
 */
function getCategoryClassColor(category) {
  return category.toLowerCase().replace(/ /g, "_") + "_bg_color";
}

/**
 * Generates the HTML code for displaying assigned to icons.
 *
 * @param {Array} contacts - An array of contact objects.
 * @return {string} The HTML code for displaying assigned to icons.
 */
function getAssignedToIconsHTML(contacts) {
  let html = /*html*/ `<div class="overlapped_contact_icons">`;
  let shift = 0;
  contacts.forEach((contact) => {
    let initials = getInitials(contact.name);
    html += /*html*/ `<div class='contacts_icon' style="background-color: ${contact.color}; transform: translateX(${shift}px);">${initials}</div>`;
    shift -= 10;
  });
  html += /*html*/ `</div>`;
  return html;
}

/**
 * Retrieves the HTML content for displaying subtasks based on the provided task object.
 *
 * @param {Object} task - The task object containing subtasks.
 * @return {string} The HTML content representing the subtasks area with progress bar and summary.
 */
function getSubTaskHTML(task) {
  const subtasks = task.subtasks;
  let counter = 0;
  subtasks.forEach((subtask) => {
    if (subtask.checked) {
      counter++;
    }
  });
  const subtaskSummary = counter + "/" + subtasks.length + "Subtasks";
  const progress = (counter / subtasks.length) * 100;
  let html = /*html*/ `
      <div class="subtasks_area">
        <div class="progress_bar">
          <div class='progress_bar_level' style="width: ${progress}%"></div>
        </div>
        <span class='subtasks_summary'>${subtaskSummary}
      </div>
    `;
  return html;
}

/**
 * Sets the opacity of the ghost element to 1 when a draggable element is hovering over the drop area.
 *
 * @param {Event} ev - The drag event.
 * @param {string} id - The ID of the drop target.
 */
function allowDrop(ev, id) {
  ev.preventDefault();
  let ghost = document.getElementById(id + "Ghost");
  ghost.style.opacity = 1;
}


/**
 * Moves a task to a new status and updates the server and HTML accordingly.
 *
 * @param {string} status - The new status of the task.
 * @return {Promise<void>} A promise that resolves when the task has been moved and the HTML has been updated.
 */
async function moveTo(status) {
  showElement("pleaseWait");
  let task = tasks.find((t) => t.id == currentDraggedElement);
  if (task.status != status) {
    task.status = status;
    // save on server
    await updateContactsAboutTask(task);
  }
  hideElement("pleaseWait");
  updateHTML(tasks);
}

/**
 * Removes the highlight from the element with the specified ID.
 *
 * @param {string} id - The ID of the element.
 * @return {void} This function does not return a value.
 */
function removeHighlight(id) {
  let ghost = document.getElementById(id + "Ghost");
  ghost.style.opacity = 0;
}

/**
 * Searches for tasks based on the input in the "searchInput" element.
 *
 * @param {string} search - The search term entered by the user.
 * @return {void} This function does not return a value.
 */
function searchTask() {
  const search = getElementWithId("searchInput");
  if (!isWhiteSpaceOnly(search.value)) {
    let results = [];
    tasks.forEach((task) => {
      if (task.title.toLowerCase().includes(search.value.toLowerCase()) || task.description.toLowerCase().includes(search.value.toLowerCase())) {
        results.push(task);
      }
    });
    updateHTML(results);
  } else updateHTML(tasks);
}

/**
 * Opens the create task form with the specified status.
 *
 * @param {string} status - The status of the task to be created.
 * @return {void} This function does not return a value.
 */
function openCreateTask(status) {
  addedTask = { assign_to: [], subtasks: [] };
  if (status) addedTask.status = status;
  else addedTask.status = "toDo";
  getElementWithId("createTask").classList.remove("d_none");
  initUserAndGenerateHTML();
}

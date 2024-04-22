let tasks = []; 
const SUBTASK_CHECKBOX_PATH = '../../img/checkbox_board';
let cols =  ['toDo', 'inProgress', 'awaitFeedback', 'done'];


let currentDraggedElement;

/**
 * The function is filtering the tasks according to their status.
 * @returns JSON array
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

function getNoTasksToDoHTML() {
  return /*html*/ `
    <div class="no_tasks_to_do">No tasks To do</div>
  `;
}

async function initBoard() {
  user = await getUserFromServer(emailParameter);
  tasks = user.tasks;
  const userContact = {name: (user.name + ' (You)'), email: user.email, color: user.color};
  console.log(tasks);
  updateHTML(tasks);
  allContacts = [...user.contacts, userContact];
}

/**
 * The function is updating the HTML for all the tasks.
 */
function updateHTML(array) {
  const columns = resetColumns(array);
  columns.forEach((column) => {
    document.getElementById(`${column.name}`).innerHTML = "";
    if (column.cards.length > 0) {
      column.cards.forEach((card) => (document.getElementById(`${column.name}`).innerHTML += generateSmallTaskHTML(card)));
      document.getElementById(`${column.name}`).innerHTML += generateHighlightedCardGhostHTML(column.name);
    } else document.getElementById(`${column.name}`).innerHTML = getNoTasksToDoHTML();
  });
}

function startDragging(id) {
  currentDraggedElement = id;
  getElementWithId(id).classList.add("drag_highlight");
}

function generateHighlightedCardGhostHTML(columnName) {
  return /*html*/ `
    <div id="${columnName}Ghost" class="card_small_ghost d_none"></div>
  `;
}

function generateSmallTaskHTML(task) {
  const category = task.category;
  const categoryColor = user.categories.find((c) => c.name == category);
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

function getCategoryClassColor(category) {
  return category.toLowerCase().replace(/ /g, "_") + "_bg_color";
}

function getAssignedToIconsHTML(contacts) {
  let html = /*html*/ `<div class="overlapped_contact_icons">`;
  let shift = 0;
  contacts.forEach((contact) => {
    let initials = getInitials(contact.name);
    html += /*html*/ `<div class='contacts_icon' style="background-color: ${contact.color}; transform: translateX(${shift}px);">${initials}</div>`;
    shift -= 10;
  });
  html += /*html*/`</div>`;
  return html;
}

function getSubTaskHTML(card) {
  const subtasks = card.subtasks;
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

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(status) {
  showElement('pleaseWait');
  let task = tasks.find((t) => t.id == currentDraggedElement);
  task.status = status;
  // save on server
  await updateContactsAboutTask(task);
  updateHTML(tasks);
  hideElement('pleaseWait');
}

function highlight(event, id) {
  let ghost = document.getElementById(id + 'Ghost');
  // if (ghost.classList.contains("d_none")) {
    if (event.target.className == "droptarget"){
    ghost.classList.remove("d_none");
   }
}

function removeHighlight( event,id) {
  let ghost = document.getElementById(id + 'Ghost');
  // if(!ghost.classList.contains("d_none")) {
    if (event.target.className == "droptarget") {
    ghost.classList.add("d_none");
   }
}

function searchTask() {
  const search = getElementWithId("searchInput");
  if (!isWhiteSpaceOnly(search.value)) {
    let results = [];
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(search.value.toLowerCase()) || task.description.toLowerCase().includes(search.value.toLowerCase())){
        results.push(task);
      }
    });
    updateHTML(results);
  } else updateHTML(tasks);
}

function openCreateTask(status){
  addedTask = { assign_to: [], subtasks: [] };
  if (status)
   addedTask.status= status;
  else addedTask.status = 'toDo';
  getElementWithId("createTask").classList.remove("d_none");
  initUserAndGenerateHTML();
}
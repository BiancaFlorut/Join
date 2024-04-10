let tasks = []; 

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
  tasks = await getTaskList(emailParameter);
  console.log(tasks);
  updateHTML(tasks);
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
    } else document.getElementById(`${column.name}`).innerHTML = getNoTasksToDoHTML();
  });
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateSmallTaskHTML(task) {
  const category = task.category;
  const colorClass = getCategoryClassColor(category);
  let subtasksHTML = "";
  if (task.subtasks.length > 0) subtasksHTML = getSubTaskHTML(task);
  const priorityString = getTaskPriority(task.priority);
  return (
    /*html*/ `
    <div draggable="true" ondragstart="startDragging('${task["id"]}')" class="card_small" onclick="openTask('${task.id}')">
      <div class="task_category ${colorClass}">${task.category}</div>
      <div class="task_text_area">
        <div class="task_header">${task["title"]}</div>
        <div class="task_description">${task.description}</div>
      </div>` +
    subtasksHTML +
    /*html*/ `
      <div class='small_card_footer'>
        <div class="small_card_users_area">` +
    getAssignedToIconsHTML(task.assign_to) +
    /*html*/ `
          <div class="small_task_priority"><img src="../../img/${priorityString}.svg" alt=""></div>
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
    let initials = "";
    const names = contact.name.split(" ");
    names.forEach((name) => (initials += name.charAt(0)));
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

function getTaskPriority(priority) {
  switch (priority) {
    case 0:
      return "priority_low";
    case 1:
      return "priority_medium";
    case 2:
      return "priority_urgent";
    default:
      break;
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  let task = tasks.find((t) => t.id == currentDraggedElement);
  task.status = status;
  // to do: save on the server!!!!
  updateHTML(tasks);
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function searchTask() {
  const search = getElementWithId("searchInput");
  if (search.value) {
    getElementWithId("magnifyingGlassIcon").src = "../../img/magnifying_glass_blue.svg";
    let results = [];
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(search.value.toLowerCase()) || task.description.toLowerCase().includes(search.value.toLowerCase())){
        results.push(task);
      }
    });
    updateHTML(results)
    getElementWithId("magnifyingGlassIcon").src = "../../img/board_input_find_task_search.svg";
  } else updateHTML(tasks);
}

function openTask(id) {
  showElement('bigCardView');
  let container = getElementWithId('bigCardContent');
  const task = tasks.find( t => t.id == id);
  const d = new Date(task.due_date);
  const formattedDate = d.toLocaleDateString('de-De').replaceAll('.', '/');
  const priority = getTaskPriority(task.priority);
  container.innerHTML = /*html*/`
    <div class="big_card_header">
      <div class='big_card_category ${getCategoryClassColor(task.category)}'>${task.category}</div>
      <div class="close_icon" onclick="closeBigCardView()">
        <img src="../../img/close_black.svg" alt="close">
      </div>
    </div>
    <h1>${task.title}</h1>
    <span>${task.description}</span>
    <div>
      <span class="pr_25">Due Date:</span>
      <span>${formattedDate}</span>
    </div>
    <div class='df_ac'>
      <span class="pr_25">Priority:</span>
      <div class='priority_area' >
        <span class="pr_10" style="text-transform: capitalize;">${priority.split('_')[1]}</span>
        <img src="../../img/${priority}.svg" alt="">
      </div>
    </div>
    <span>Assigned To:</span>
    <div>`
      + getAssignedToHTML(task.assign_to) +
    /*html*/`
    </div>
  `;
}

function getAssignedToHTML(array) {
  return /*html*/`
      
  `;
}

function closeBigCardView(){
  hideElement('bigCardView');
}
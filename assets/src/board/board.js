let tasks = []; 
let user;
const SUBTASK_CHECKBOX_PATH = '../../img/checkbox_board';

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
  user = await getUserFromServer(emailParameter);
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
    let initials = getInitials(contact.name);
    html += /*html*/ `<div class='contacts_icon' style="background-color: ${contact.color}; transform: translateX(${shift}px);">${initials}</div>`;
    shift -= 10;
  });
  html += /*html*/`</div>`;
  return html;
}

function getInitials(name) {
  let initials = '';
  const names = name.split(" ");
    names.forEach((name) => (initials += name.charAt(0)));
    return initials;
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
      <span class="big_card_title">Due Date:</span>
      <span>${formattedDate}</span>
    </div>
    <div class='df_ac'>
      <span class="big_card_title">Priority:</span>
      <div class='priority_area' >
        <span class="pr_10" style="text-transform: capitalize;">${priority.split('_')[1]}</span>
        <img src="../../img/${priority}.svg" alt="">
      </div>
    </div>
    <div class="big_card_assigned_to_area">
      <span class="big_card_title">Assigned To:</span>
      <div class="big_card_assigned_to_list">`
        + getAssignedToHTML(task.assign_to) +/*html*/`
      </div>
    </div>
    <div class="big_card_assigned_to_area">
      <span class="big_card_title">Subtasks</span>
      <div class="big_card_assigned_to_list">`
        + getSubTaskForBigCardHTML(task) +/*html*/`
      </div>
    </div>
    <div class='big_card_footer df_ac'>
      <div class='big_card_change df_ac' onmouseover="changeIdImgTheSrc('deleteIcon', '../../img/delete_blue.svg')" onmouseout="changeIdImgTheSrc('deleteIcon', '../../img/delete.svg')">
        <img id="deleteIcon" src="../../img/delete.svg" alt="delete">
        <span>Delete</span>
      </div>
      <img src="../../img/input_vertical_line.svg" alt="">
      <div class='big_card_change df_ac' onmouseover="changeIdImgTheSrc('editIcon', '../../img/edit_blue.svg')" onmouseout="changeIdImgTheSrc('editIcon', '../../img/edit.svg')">
        <img id="editIcon" src="../../img/edit.svg" alt="edit">
        <span>Edit</span>
      </div>
    </div>
  `;
}

function getSubTaskForBigCardHTML(task) {
  let subtasks = task.subtasks;
  let html = '';
  subtasks.forEach(function (subtask, index) {
    const checkbox = subtask.checked ? SUBTASK_CHECKBOX_PATH +'_checked.svg' : SUBTASK_CHECKBOX_PATH + '.svg';
    html += /*html*/`
      <div class="big_card_subtask_area df_ac">
        <img src="${checkbox}" alt="checkbox" onclick="toggleSubtaskCheckbox(this, '${task.id}', ${index})">
        <span>${subtask.text}</span>
      </div>`;
  });
  return html;
}

function getAssignedToHTML(array) {
  let html = '';
  array.forEach(contact => html += getContactForBigCardHTML(contact));
  return html;
}

function getContactForBigCardHTML(contact) {
  let you = contact.name == user.name ? ' (You)' : ''; 
  return /*html*/`
    <div class='big_card_assigned_to'>
      <div class='contacts_icon' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
      <div>${contact.name + you}</div>
    </div>
  `
}

function closeBigCardView(){
  hideElement('bigCardView');
}

function changeIdImgTheSrc(id, src) {
  changeSrc(getElementWithId(id), src);
}

function toggleSubtaskCheckbox(element, taskId, i) {
  let taskIndex = tasks.findIndex(t => t.id == taskId);
  let task = tasks.find((t, index) => t.id == taskId);
  let isChecked = task.subtasks[i].checked;
  tasks[taskIndex].subtasks[i].checked = toggleCheckbox(element, isChecked, SUBTASK_CHECKBOX_PATH);
  updateHTML(tasks);
  //replace the task with the updated subtask then change the task for the assigned to contacts.
}
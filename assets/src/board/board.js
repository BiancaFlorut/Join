let tasks = [
  {
    id: 0,
    title: "Putzen",
    status: "awaitFeedback",
  },
  {
    id: 1,
    title: "Kochen",
    status: "awaitFeedback",
  },
  {
    id: 2,
    title: "Einkaufen",
    status: "done",
  },
  {
    id: 3,
    title: "Joggen",
    status: "inProgress",
  },
  {
    id: 4,
    title: "Schlafen",
    status: "awaitFeedback",
  },
  {
    id: 5,
    title: "Putzen",
    status: "awaitFeedback",
  },
  {
    id: 6,
    title: "Kochen",
    status: "awaitFeedback",
  },
  {
    id: 7,
    title: "Einkaufen",
    status: "done",
  },
  {
    id: 8,
    title: "Joggen",
    status: "inProgress",
  },
  {
    id: 9,
    title: "Schlafen",
    status: "awaitFeedback",
  },
];

let currentDraggedElement;

/**
 * The function is filtering the tasks according to their status.
 * @returns JSON array
 */
function resetColumns() {
  const toDo = tasks.filter((t) => t["status"] == "toDo" || !t.status);
  const inProgress = tasks.filter((t) => t.status == "inProgress");
  const awaitFeedback = tasks.filter((t) => t.status == "awaitFeedback");
  const done = tasks.filter((t) => t["status"] == "done");
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
  updateHTML();
}

/**
 * The function is updating the HTML for all the tasks.
 */
function updateHTML() {
  const columns = resetColumns();
  columns.forEach((column) => {
    document.getElementById(`${column.name}`).innerHTML = "";
    if (column.cards.length > 0) {
      column.cards.forEach((card) => (document.getElementById(`${column.name}`).innerHTML += generateSmallTaskHTML(card)));
    }
    else document.getElementById(`${column.name}`).innerHTML = getNoTasksToDoHTML();
  });
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateSmallTaskHTML(task) {
  const category = task.category;
  const colorClass = category.toLowerCase().replace(/ /g, "_") + "_bg_color";
  let subtasksHTML = "";
  if (task.subtasks.length > 0) subtasksHTML = getSubTaskHTML(task);
  const priorityString = getTaskPriority(task.priority);
  return (
    /*html*/ `
    <div draggable="true" ondragstart="startDragging('${task["id"]}')" class="card_small">
      <div class="task_category ${colorClass}">${task.category}</div>
      <div class="task_text_area">
        <div class="task_header">${task["title"]}</div>
        <div class="task_description">${task.description}</div>
      </div>` +
      subtasksHTML +
      /*html*/`
      <div class='small_card_footer'>
        <div class="small_card_users_area">`
        + getAssignedToIconsHTML(task.assign_to) +
        /*html*/`
          <div class="small_task_priority"><img src="../../img/${priorityString}.svg" alt=""></div>
        </div>
      </div>
    </div>`
  );
}

function getAssignedToIconsHTML(contacts) {
  return /*html*/`
    <div>

    </div>
  `;
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
    case 0: return 'priority_low';
    case 1: return 'priority_medium';
    case 2: return 'priority_urgent';
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
  updateHTML();
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
    console.log(".....search task: " + search.value);
    getElementWithId("magnifyingGlassIcon").src = "../../img/board_input_find_task_search.svg";
  }
  search.value = "";
}
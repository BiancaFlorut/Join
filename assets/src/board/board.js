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

  return columns = [
    { name: "toDo", cards: toDo },
    { name: "inProgress", cards: inProgress },
    { name: "awaitFeedback", cards: awaitFeedback },
    { name: "done", cards: done },
  ];
}

async function initBoard() {
  let user = await getUserFromServer(emailParameter);
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
    column.cards.forEach((card) => (document.getElementById(`${column.name}`).innerHTML += generateSmallTaskHTML(card)));
  });
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateSmallTaskHTML(element) {
  const category = element.category;
  const colorClass = category.toLowerCase().replace(/ /g,'_') + '_bg_color';
  let subtasksHTML = '';
  if (element.subtasks.length > 0) subtasksHTML = getSubTaskHTML(element.subtasks);
  return /*html*/`
    <div draggable="true" ondragstart="startDragging(${element["id"]})" class="card_small">
    <div class="task_category ${colorClass}">${element.category}</div>
    <div class="task_text_area">
      <div class="task_header">${element["title"]}</div>
      <div class="task_description">${element.description}</div>
    </div>` + subtasksHTML + `

    </div>`;
}

function getSubTaskHTML(subtasks) {
    let counter = 0;
    subtasks.forEach(subtask => {if (subtask.checked) {
      counter++;
    }});

    const subtaskSummary = counter + '/' + subtasks.length + 'Subtasks';
    return /*html*/`
      <div class="subtasks_area">
        <div class="progress_bar">
          <div id="progress_level" class='progress_bar_level'></div>
        </div>
        <span class='subtasks_summary'>${subtaskSummary}</div>
      </div>
    `;
}

function setProgressLevel() {
  // 
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
} 

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function searchTask(){
    const search = getElementWithId('searchInput');
    if (search.value) {
        getElementWithId('magnifyingGlassIcon').src = '../../img/magnifying_glass_blue.svg';
        console.log('.....search task: '+ search.value );
        getElementWithId('magnifyingGlassIcon').src = '../../img/board_input_find_task_search.svg';
    }
    search.value = '';
}


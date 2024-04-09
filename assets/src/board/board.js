let tasks = [
  {
    id: 0,
    title: "Putzen",
    category: "awaitFeedback",
  },
  {
    id: 1,
    title: "Kochen",
    category: "awaitFeedback",
  },
  {
    id: 2,
    title: "Einkaufen",
    category: "done",
  },
  {
    id: 3,
    title: "Joggen",
    category: "inProgress",
  },
  {
    id: 4,
    title: "Schlafen",
    category: "awaitFeedback",
  },
  {
    id: 5,
    title: "Putzen",
    category: "awaitFeedback",
  },
  {
    id: 6,
    title: "Kochen",
    category: "awaitFeedback",
  },
  {
    id: 7,
    title: "Einkaufen",
    category: "done",
  },
  {
    id: 8,
    title: "Joggen",
    category: "inProgress",
  },
  {
    id: 9,
    title: "Schlafen",
    category: "awaitFeedback",
  },
];

let currentDraggedElement;
let users;


/**
 * The function is filtering the tasks in the according category they are assigned to.
 * @returns JSON array 
 */
function resetColumns() {
  const toDo = tasks.filter((t) => t["category"] == "toDo");
  const inProgress = tasks.filter((t) => t.category == "inProgress");
  const awaitFeedback = tasks.filter((t) => t.category == "awaitFeedback");
  const done = tasks.filter((t) => t["category"] == "done");

  return columns = [
    { name: "toDo", cards: toDo },
    { name: "inProgress", cards: inProgress },
    { name: "awaitFeedback", cards: awaitFeedback },
    { name: "done", cards: done },
  ];
}

async function initBoard() {
  users = await loadUsersFromServer();
  
  console.log(emailParameter);
  let user = await getUserFromServer(emailParameter);
  let tasks = await getTaskList(emailParameter);
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
    column.cards.forEach((card) => (document.getElementById(`${column.name}`).innerHTML += generateTodoHTML(card)));
  });
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTodoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element["id"]})" class="todo">${element["title"]}</div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  tasks[currentDraggedElement]["category"] = category;
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


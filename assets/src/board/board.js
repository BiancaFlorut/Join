let tasks = [
  {
    id: 0,
    title: "Putzen",
    category: "toDo",
  },
  {
    id: 1,
    title: "Kochen",
    category: "toDo",
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
];

let currentDraggedElement;

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

// e-mail from href browser
let url = window.location.href;
let params = new URLSearchParams(new URL(url).search);
let urlEmail = params.get('email');
// variables for page
let user = [];
let userName = user.name;
let tasks = [];

async function summaryInit() {
    await findUser();
    await findTasks();
    welcomeUser();
    tasksInBoard();
    numberOfTodo();
    numberOfDone();
    tasksProgress();
    awaitingFeedback();
    awaitingUrgent();
    // verkleinerung der Tasksuche:
    // updateTaskStatusCount("awaitFeedback");
    // updateTaskStatusCount("inProgress");
    // updateTaskStatusCount("done");
    // updateTaskStatusCount("toDo");
}

function searchTaskStatus(tasks, status) {
    return tasks.filter(task => task.status === status);
   }
// zu kürzender code, bis nächstes grünes
function awaitingFeedback() {
    let blubber = searchTaskStatus(tasks, "awaitFeedback");
    document.getElementById('awaitingFeedback').innerHTML = blubber.length;
}

function tasksProgress() {
    let blubber = searchTaskStatus(tasks, "inProgress");
    document.getElementById('tasksProgress').innerHTML = blubber.length;
}

function numberOfDone() {
    let blubber = searchTaskStatus(tasks, "done");
    document.getElementById('numberOfDone').innerHTML = blubber.length;
}

function numberOfTodo() {
    let blubber = searchTaskStatus(tasks, "toDo");
    document.getElementById('numberOfTodo').innerHTML = blubber.length;
}
// verkleinerung der tasksuche
// function updateTaskStatusCount(status) {
//     let elementStatus = searchStatus(tasks, status);
//     document.getElementById(`${status}Count`).innerHTML = elementStatus.length;
// }

/**
 * function shows how many tasks have the priority Urgent
 */
function awaitingUrgent() {
    let urgentElement = searchUrgentStatus(tasks, 2);
    document.getElementById('numberOfUrgent').innerHTML = urgentElement.length;
}

/**
 * function is a subfunction of awaitingUrgent(), it is a comparison function
 * @param {*} tasks 
 * @param {*} priority 
 * @returns 
 */
function searchUrgentStatus(tasks, priority) {
    return tasks.filter(task => task.priority === priority);
}


async function findUser() {
    let userServer = await getUserFromServer(urlEmail);
    user.push(userServer);
    user = user[0];
}

async function findTasks() {
    let userTasks = await getTaskList(urlEmail);
    tasks.push(userTasks);
    tasks = tasks[0];
    console.log(tasks);
}


/**
 * function change die <img> src path, whenn we hover the mouse ofer the <a>
 * 
 * 
 */
document.addEventListener('DOMContentLoaded', function() {
    function toggleImage(elementId, hoverSrc, originalSrc) {
        let linkElement = document.getElementById(elementId);
        linkElement.addEventListener('mouseover', function() {
            this.querySelector('img').src = hoverSrc;
        });
        linkElement.addEventListener('mouseout', function() {
            this.querySelector('img').src = originalSrc;
        });
    }
    toggleImage('todoLink', '../../img/todo_hover.svg', '../../img/todo.svg');
    toggleImage('doneLink', '../../img/done_hover.svg', '../../img/done.svg');
});

/**
 * function show all tasks
 */
function tasksInBoard() {
    let allTasks = user.tasks;
    let taskBoard = document.getElementById('tasksBoard');
    taskBoard.innerHTML = allTasks.length;
}

/**
 * function to welcome the user
 * 
 * @param {string}
 */
function welcomeUser() {
    let welcome = document.getElementById('welcomeName');
    welcome.innerHTML = `${user.name}`;
}
/*
|/////////////////////////////////////////////////////////////|
|                                                             |
|                                                             |
|-------------------->ATTENTION: TESTAREA<--------------------|
|                                                             |
|                                                             |
|/////////////////////////////////////////////////////////////|
*/

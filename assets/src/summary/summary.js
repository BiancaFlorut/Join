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
    greetUser();
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
 * function shows how many tasks have the priority Urgent and shows the next due date
 */
function awaitingUrgent() {
    let urgentElement = searchUrgentStatus(tasks, 2);
    document.getElementById('numberOfUrgent').innerHTML = urgentElement.length;
    let smallestDueDate = Math.min(...urgentElement.map(task => task.due_date));
    let formattedDueDate = new Date(smallestDueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('deadline').innerHTML = formattedDueDate;
}


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
 * function shows user name
 * 
 * @param {string}
 */
function welcomeUser() {
    let welcome = document.getElementById('welcomeName');
    welcome.innerHTML = `${user.name}`;
}

/**
 * this function welcomes the user depending on the time of day
 */
function greetUser() {
    const currentHour = new Date().getHours();
    let greeting;
    if (currentHour < 12) {
        greeting = "Good morning,";
    } else if (currentHour < 18) {
        greeting = "Welcome,";
    } else {
        greeting = "Good evening,";
    }
    document.getElementById('welcome').innerHTML = greeting;
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
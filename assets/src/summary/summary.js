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
    awaitingUrgent();
    searchTasksInit();
}

// document.addEventListener('DOMContentLoaded', function() {
//     let divElement = document.getElementById('summaryContentRight');
//     if (window.innerWidth <= 720) {
//         setTimeout(function() {
//             divElement.classList.add('d-none');
//         }, 2500);
//     } else {
//         divElement.classList.remove('d-none');
//     }
// })

function toggleVisibilityBasedOnWidth() {
    let divElement = document.getElementById('summaryContentRight');
    if (window.innerWidth <= 720) {
        setTimeout(function() {
            divElement.classList.add('d-none');
        }, 2500);
    } else {
        divElement.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', toggleVisibilityBasedOnWidth);

window.addEventListener('resize', toggleVisibilityBasedOnWidth);

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

function searchTasksInit() {
    updateTaskCount("awaitFeedback", 'awaitingFeedback');
    updateTaskCount("inProgress", 'tasksProgress');
    updateTaskCount("done", 'numberOfDone');
    updateTaskCount("toDo", 'numberOfTodo');
}

function searchTaskStatus(tasks, status) {
    return tasks.filter(task => task.status === status);
}

function updateTaskCount(status, elementId) {
    let elementStatus = searchTaskStatus(tasks, status);
    document.getElementById(elementId).innerHTML = elementStatus.length;
}

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

/**
 * function change die <img> src path, whenn we hover the mouse ofer the <a>
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
// e-mail from href browser
let url = window.location.href;
let params = new URLSearchParams(new URL(url).search);
let urlEmail = params.get('email');
// variables for page
let tasks = [];

/**
 * Asynchronously initializes the summary by finding the user, tasks, and performing various user-related actions.
 *
 * @return {Promise<void>} A Promise that resolves when the summary has been initialized.
 */
async function summaryInit() {
    await findUser();
    await findTasks();
    welcomeUser();
    greetUser();
    tasksInBoard();
    awaitingUrgent();
    searchTasksInit();
}
/**
 * Function to toggle visibility of an element based on the window width.
 *
 * @return {void} No return value
 */
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

/**
 * Function to find a user by fetching data from the server.
 *
 * @return {Promise<void>} Resolves when the user is found and updated.
 */
async function findUser() {
    user = await getUserFromServer(urlEmail);
}

/**
 * Asynchronously finds tasks for a user and updates the tasks array.
 *
 * @return {Promise<void>} A Promise that resolves when the tasks have been updated.
 */
async function findTasks() {
    let userTasks = await getTaskList(urlEmail);
    tasks.push(userTasks);
    tasks = tasks[0];
}

/**
 * Initializes the search tasks by updating the task counts for each status and element ID.
 *
 * @param {string} awaitFeedback - The status for awaiting feedback.
 * @param {string} tasksProgress - The status for in-progress tasks.
 * @param {string} numberOfDone - The status for completed tasks.
 * @param {string} numberOfTodo - The status for tasks to be done.
 * @return {void} This function does not return a value.
 */
function searchTasksInit() {
    updateTaskCount("awaitFeedback", 'awaitingFeedback');
    updateTaskCount("inProgress", 'tasksProgress');
    updateTaskCount("done", 'numberOfDone');
    updateTaskCount("toDo", 'numberOfTodo');
}

/**
 * Filters the given array of tasks based on the status and returns a new array
 * containing only the tasks with the specified status.
 *
 * @param {Array} tasks - The array of tasks to filter.
 * @param {string} status - The status to filter by.
 * @return {Array} The filtered array of tasks.
 */
function searchTaskStatus(tasks, status) {
    return tasks.filter(task => task.status === status);
}

/**
 * Updates the task count for a given status and element ID.
 *
 * @param {string} status - The status of the tasks to count.
 * @param {string} elementId - The ID of the element to update with the count.
 * @return {void} This function does not return a value.
 */
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
    if (urgentElement.length == 0) {
        document.getElementById('deadline').innerHTML = 'No due date';
    } else {
    let smallestDueDate = Math.min(urgentElement.map(task => Date.parse(task.due_date)));
    let formattedDueDate = new Date(smallestDueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('deadline').innerHTML = formattedDueDate;
    }
}

/**
 * Filters the given array of tasks based on the priority and returns a new array
 * containing only the tasks with the specified priority.
 *
 * @param {Array} tasks - The array of tasks to filter.
 * @param {number} priority - The priority to filter by.
 * @return {Array} The filtered array of tasks.
 */
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
 * This function welcomes the user depending on the time of day
 *
 * @return {void} No return value
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
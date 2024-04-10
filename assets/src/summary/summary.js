// e-mail from href browser
let url = window.location.href;
let params = new URLSearchParams(new URL(url).search);
let urlEmail = params.get('email');
// variables for page
let user = [];
let userName = user.name;

async function summaryInit() {
    // await getUserFromServer(urlEmail);
    await findUser();
    welcomeUser();
    tasksInBoard();
}

async function findUser() {
    let userServer = await getUserFromServer(urlEmail);
    user.push(userServer);
    user = user[0];
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
 * function looking for user with the same email-adress
 * 
 * 
 */
// function findUserFromEmail(users, urlEmail) {
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].email === urlEmail) {
//             return users[i];
//         }
//     }
//     return null; 
// }

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

function tasksInBoard() {
    let allTasks = user.tasks;
    let taskBoard = document.getElementById('tasksBoard');
    taskBoard.innerHTML = allTasks.length;
}





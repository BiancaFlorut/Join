const urlParams = new URLSearchParams(window.location.search);
const emailParameter = urlParams.get('email');
let initialLetters = [];

/**
 * Initializes the templates by extracting first letters and hiding the question mark.
 *
 * @param {void} - No parameters
 * @return {void} - No return value
 */
function templatesInit() {
    extractFirstLetters();
    hiddenQuestionMark();
}

/**
 * this function integrates html templates
 *
 * @param {html-include} templates
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file); 
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * this function makes a menu appear, for this I delete the div a css class called d-none
 *
 * @param {class} class
 */
function openPopupMenu() {
    let element = document.getElementById("popupMenuHeader");
    element.classList.remove("d-none");
}

/**
 * this function makes a menu disappear, for this I give the div a css class called d-none
 *
 * @param {class} class
 */
function closePopupMenu() {
    let element = document.getElementById("popupMenuHeader");
    element.classList.add("d-none");
}

/**
 * function to show where you are on the nav-bar
 * 
 * 
 */
function selectedPage() {
    let element = document.getElementById(`${document.title}`);
    element.classList.add("selected-page");
}

/**
 * the function sets the parameter query for board in order to load information from server for the logged user.
 */
function setParameterQuery() {
    document.getElementById('Board').href = '../board/board.html?email=' + emailParameter;
    document.getElementById('Contacts').href = '../contacts/contacts.html?email=' + emailParameter;
    document.getElementById('Summary').href = '../summary/summary.html?email=' + emailParameter;
    document.getElementById('Privacy Policy').href = '../privacy_policy/privacy_policy.html?email=' + emailParameter;
    document.getElementById('Legal Notice').href = '../legal_notice/legal_notice.html?email=' + emailParameter;
    document.getElementById('Help').href = '../help/help.html?email=' + emailParameter;
    document.getElementById('Add Task').href = '../add_task/add_task.html?email=' + emailParameter;
    setParameterQueryHeader(emailParameter);
    setParameterQuerySummary(emailParameter);
}

/**
 * Sets the parameter query for the header section of the page.
 *
 * @param {string} emailParameter - The email parameter to be included in the query string.
 * @return {void} This function does not return a value.
 */
function setParameterQueryHeader(emailParameter) {
    document.getElementById('headerHelp').href = '../help/help.html?email=' + emailParameter;
    document.getElementById('headerLegalNotice').href = '../legal_notice/legal_notice.html?email=' + emailParameter;
    document.getElementById('headerPrivacyPolicy').href = '../privacy_policy/privacy_policy.html?email=' + emailParameter;    
}

/**
 * Sets the parameter query for the summary section of the board.
 *
 * @param {string} emailParameter - The email parameter to be included in the query string.
 * @return {void} This function does not return a value.
 */
function setParameterQuerySummary(emailParameter) {
    const linkIds = ['todoLink', 'urgentLink', 'doneLink', 'taskLink', 'progressLink', 'feedbackLink'];
    function setHref(id) {
        const element = document.getElementById(id);
        if (element) {
            element.href = `../board/board.html?email=${emailParameter}`;
        }
    }
    linkIds.forEach(setHref);
}

/**
 * function extract initials from a namestring
 * 
 * @param {*} name 
 * @returns
 */
async function extractFirstLetters() {
    let user = await getUserFromServer(emailParameter);
    let words = (user.name).split(' '); 
    for (let i = 0; i < words.length; i++) { 
        initialLetters.push(words[i].charAt(0));
        showInitials();
    }
    return initialLetters.join(''); 
}

/**
 * function to show the initials
 * 
 * @param {string}
 */
function showInitials() {
    let welcome = document.getElementById('userInitials');
    welcome.innerHTML = ``;
    for (let i = 0; i < initialLetters.length; i++) {
        let element = initialLetters[i];
        welcome.innerHTML += `${element}`;
    }
}

/**
 * Hides the "Help" button if the document title is "Help".
 *
 * @return {void} This function does not return anything.
 */
function hiddenQuestionMark() {
    let title = document.title;
    if (title == "Help") {
        let button = document.getElementById("Help");
        button.classList.add("d-none");
    }
}

/**
 * Navigates back to the previous page in the browser history.
 *
 * @return {void} This function does not return anything.
 */
function lastPage() {
    window.history.back();
}

function checkQueryParametersAndHideDivs() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQueryParams = urlParams.toString().length > 0;
    if (!hasQueryParams) {
        const screenWidth = window.innerWidth;
        const navContainerDiv = document.getElementById('navContainer');
        const navBarDiv = document.getElementById('navBar');
        if (screenWidth <= 1130) {
            if (navBarDiv) {
                navBarDiv.classList.add('d_none');
                navContainerDiv.classList.remove('d_none');
            }
        } else {
            if (navContainerDiv) {
                navContainerDiv.classList.add('d_none');
                navBarDiv.classList.remove('d_none');
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', checkQueryParametersAndHideDivs);
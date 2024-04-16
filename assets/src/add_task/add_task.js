let addedTask = {assign_to: []};
let isContactListOpen = false;
let user;
let allContacts;


// function togglePriorityTo(priorityValue, buttonElement) {
    // addTask.priority = priorityValue;
//     resetPriorityButtons();
//     let classList = getPriorityButtonsClasses(priorityValue).split(" ");
//     buttonElement.classList.add(...classList);
// }

// function resetPriorityButtons() {
//     for (let i = 0; i < 3; i++) {
//       let classList = getElementWithId("buttonPriority" + i).classList;
//       classList.remove("clicked");
//       classList.remove(getTaskPriority(i));
//     }
//   }

async function initAddTask() {
    let container = getElementWithId("addTaskAssignedContacts");
    user = await getUserFromServer(emailParameter);
    const userContact = {name: (user.name + ' (You)'), email: user.email, color: user.color};
    allContacts = [...user.contacts, userContact];
  container.innerHTML = getOptionForAssignedTo(allContacts, addedTask);
}

function setToggleForTheContactList(imgElement, idList) {
    isContactListOpen = toggleContactsList(imgElement, idList, isContactListOpen);
}

function selectContact(element, email, checked) {
    checked = toggleSelectedContact(element, email, checked, addedTask);
    const arg1 = "'" + email + "'";
    const arg2 = "'" + checked + "'";
    element.setAttribute("onclick", `selectContact(this, ${arg1}, ${arg2})`);
    getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
  }
let addTask = {assign_to: []};
let isContactListOpen = false;
let contact = [];

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
    contacts = await getContactList(emailParameter);
  container.innerHTML = getOptionForAssignedTo(contacts, addTask);
}

function setToggleForTheContactList(imgElement, idList) {
    isContactListOpen = toggleContactsList(imgElement, idList, isContactListOpen);
}
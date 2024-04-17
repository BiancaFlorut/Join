let addedTask = { assign_to: [], subtasks: [] };
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
  const userContact = { name: user.name + " (You)", email: user.email, color: user.color };
  allContacts = [...user.contacts, userContact];
  container.innerHTML = getOptionForAssignedTo(allContacts, addedTask);
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    istContactListOpen = toggleContactsList(getElementWithId("bigCardEdiSearchIcon"), "addTaskAssignedContacts", 'bigCardEdiSearchContact', isContactListOpen);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("addTaskAssignedContacts").innerHTML = getOptionForAssignedTo(allContacts, addedTask);
  };
}

function setToggleForTheContactList() {
  const imgElement = getElementWithId('bigCardEdiSearchIcon');
  isContactListOpen = toggleContactsList(imgElement, 'addTaskAssignedContacts', 'bigCardEdiSearchContact', isContactListOpen);
}

function selectContact(element, email, checked) {
  checked = toggleSelectedContact(element, email, checked, addedTask);
  const arg1 = "'" + email + "'";
  const arg2 = "'" + checked + "'";
  element.setAttribute("onmousedown", `simulateClick(event, this, ${arg1}, ${arg2})`);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
}

function searchContact() {
  changeSrc(getElementWithId("bigCardEdiSearchIcon"), "../../img/arrow_drop_down_up.svg");
  getElementWithId("addTaskAssignedContacts").classList.remove("d_none");
  isContactListOpen = true;
  const searchToken = getElementWithId("bigCardEdiSearchContact").value;
  const foundContacts = allContacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("addTaskAssignedContacts");
  container.innerHTML = getOptionForAssignedTo(foundContacts, addedTask);
}

function togglePriorityTo(priorityValue, buttonElement) {
  addedTask.priority = priorityValue;
  togglePriority(priorityValue, buttonElement);
}

function confirmSubtaskEditInput() {
  let newText = getElementWithId("bigCardEditSubtaskInput").value;
  if (newText.length > 0) {
    const subtask = { text: newText, checked: false };
    addedTask.subtasks.push(subtask);
  } else {
    // delete the subtask
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
  cancelSubtaskEditInput();
}

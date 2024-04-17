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
  addedTask.assign_to.push(userContact);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(addedTask.assign_to);
  container.innerHTML = getOptionForAssignedTo(user.contacts, addedTask, user.email);
  const minDate = new Date().toISOString().split("T")[0];
  getElementWithId("addDueDate").setAttribute("min", minDate);
  togglePriorityTo(1, getElementWithId("buttonPriority1"));
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    istContactListOpen = toggleContactsList(getElementWithId("bigCardEdiSearchIcon"), "addTaskAssignedContacts", "bigCardEdiSearchContact", true);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("addTaskAssignedContacts").innerHTML = getOptionForAssignedTo(allContacts, addedTask, user.email);
  };
  user.categories = [
    { name: "Technical Task", color: "#1FD7C1" },
    { name: "User Story", color: "#0038FF" },
  ];
  showCategoryOptions();
}

function setToggleForTheContactList() {
  const imgElement = getElementWithId("bigCardEdiSearchIcon");
  isContactListOpen = toggleContactsList(imgElement, "addTaskAssignedContacts", "bigCardEdiSearchContact", isContactListOpen);
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
  container.innerHTML = getOptionForAssignedTo(foundContacts, addedTask, user.email);
}

function togglePriorityTo(priorityValue, buttonElement) {
  addedTask.priority = priorityValue;
  togglePriority(priorityValue, buttonElement);
}

function confirmSubtaskEditInput() {
  let newText = getElementWithId("addSubtasks").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    addedTask.subtasks.push(subtask);
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
  scrollToTheBottomOfTheContainer(getElementWithId("content"));
  // addedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInput();
}

function cancelSubtaskEdit(id) {
  const i = getIndexFromId(id);
  cancelEditSubtask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = addedTask.subtasks[i].text;
  element.blur();
}

function saveEditedSubtask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    addedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskHTML(i);
    element.blur();
  } else deleteEditTaskSubtask(id);
}

function deleteEditTaskSubtask(id) {
  const i = getIndexFromId(id);
  addedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(addedTask.subtasks);
}

function showCategoryOptions() {
  let container = getElementWithId("categoryContainer");
  container.innerHTML = ``;
  user.categories.forEach((category) => {
    container.innerHTML += /*html*/ `
      <div class="category" onclick="selectCategory('${category.name}')">${category.name}</div>
    `;
  });
}

function selectCategory(name) {
  addedTask.category = name;
  getElementWithId("addCategory").value = name;
  hideElement("categoryContainer");
}

function toggleCategoryOptions() {
  let container = getElementWithId("categoryContainer");
  if (container.classList.contains("d_none")) {
    showElement("categoryContainer");
  } else {
    hideElement("categoryContainer");
  }
}

function addNewCategory(inputElement) {
  inputElement.removeAttribute("readonly");
  getElementWithId("addCategory").focus();
  getElementWithId("addCategory").value = "";
  let iconsContainer = getElementWithId("addCategoryIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelCategoryEditInput()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmCategoryEditInput()">
    `;
}

function cancelCategoryEditInput() {
  let iconsContainer = getElementWithId("addCategoryIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/arrow_drop_down_down.svg" alt="" onclick="toggleCategoryOptions()">
    `;
  getElementWithId("addCategory").value = "Select task category";
}

function confirmCategoryEditInput() {
  const value = getElementWithId("addCategory").value;
  if (!isWhiteSpaceOnly(value)) {
    const newCategory = { name: value, color: selectRandomColor() };
    user.categories.push(newCategory);
    addedTask.category = newCategory;
    showCategoryOptions();
    cancelCategoryEditInput();
    getElementWithId("addCategory").value = value;
  } else cancelCategoryEditInput();
}

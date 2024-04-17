let editedTask;
let istContactListOpen = false;

function editTask(taskId) {
  let container = getElementWithId("bigCardContent");
  editedTask = structuredClone(tasks.find((t) => t.id == taskId));
  const priorityClass = getPriorityButtonsClasses(editedTask.priority);
  const due_date = new Date(editedTask.due_date);
  const valueDate = due_date.toISOString().split("T")[0];
  const minDateValue = new Date().toISOString().split("T")[0];
  let priorityClasses = ["", "", ""];
  priorityClasses[editedTask.priority] = priorityClass;
  container.innerHTML = generateEditedTaskHTML(valueDate, minDateValue, priorityClasses);
  initEvents();
}

function initEvents() {
  // editedTask.subtasks.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    istContactListOpen = toggleContactsList(getElementWithId("bigCardEdiSearchIcon"), "bigCardEditContacts", 'bigCardEdiSearchContact', true);
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("bigCardEditContacts").innerHTML = getOptionForAssignedTo(user.contacts, editedTask, user.email);
  };
  getElementWithId("addSubtasks").onblur = function () {
    let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `<img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />`;
    getElementWithId("addSubtasks").value = "";
  };
}

async function saveEditedTask() {
  console.log("is title filled ", isTitelValid());
  console.log("is description filled? ", isDescriptionValid());
  console.log("is a date filled?", isDueDateValid());
  console.log(editedTask);
  await updateContactsAboutTask(editedTask);
  closeBigCardView();
  initBoard();
}

function isDueDateValid() {
  let dueDate = getElementWithId("editedTaskDueDateInput").value;
  if (!dueDate) {
    showElement("editedTaskDueDateInputError");
    return false;
  } else {
    hideElement("editedTaskDueDateInputError");
    const date = Date.parse(new Date(dueDate));
    editedTask.due_date = date;
    return true;
  }
}

function isDescriptionValid() {
  let description = getElementWithId("editedTaskDescriptionInput").value;
  if (!isWhiteSpaceOnly(description)) {
    editedTask.description = description;
    hideElement("editedTaskDescriptionInputError");
    return true;
  } else {
    showElement("editedTaskDescriptionInputError");
    return false;
  }
}

function isTitelValid() {
  let title = getElementWithId("editedTaskTitleInput").value;
  if (!isWhiteSpaceOnly(title)) {
    editedTask.title = title;
    hideElement("editedTaskTitleInputError");
    return true;
  } else {
    showElement("editedTaskTitleInputError");
    return false;
  }
}

function confirmSubtaskEditInput() {
  let newText = getElementWithId("addSubtasks").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    editedTask.subtasks.push(subtask);
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
  scrollToTheBottomOfTheContainer(document.getElementsByClassName('big_card_edit_content_area')[0]);
  // editedTask.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInput();
}

function deleteEditTaskSubtask(id) {
  const i = getIndexFromId(id);
  editedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
}

function cancelSubtaskEdit(id) {
  const i = getIndexFromId(id);
  cancelEditSubtask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = editedTask.subtasks[i].text;
  element.blur();
}

function saveEditedSubtask(id) {
  const i = getIndexFromId(id);
  let element = getElementWithId(id);
  const text = element.innerHTML;
  if (!isWhiteSpaceOnly(text)) {
    editedTask.subtasks[i].text = text;
    element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
    element.contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = generateSubtaskHTML(i);
    element.blur();
  } else deleteEditTaskSubtask(id);
}

function searchContact() {
  changeSrc(getElementWithId("bigCardEdiSearchIcon"), "../../img/arrow_drop_down_up.svg");
  getElementWithId("bigCardEditContacts").classList.remove("d_none");
  istContactListOpen = true;
  const searchToken = getElementWithId("bigCardEdiSearchContact").value;
  const foundContacts = allContacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("bigCardEditContacts");
  container.innerHTML = getOptionForAssignedTo(foundContacts, editedTask, user.email);
}

function togglePriorityTo(priorityValue, buttonElement) {
  editedTask.priority = priorityValue;
  togglePriority(priorityValue, buttonElement);
}

function setToggleForTheContactList() {
  const imgElement = getElementWithId('bigCardEdiSearchIcon');
  istContactListOpen = toggleContactsList(imgElement, 'bigCardEditContacts', 'bigCardEdiSearchContact', istContactListOpen);
}

/**
 * This function selects an contact and add it in the editTask.assigned_to toggles the look and the checkbox
 * @param {HTMLDivElement} element
 * @param {string} email
 * @param {string} checked
 */
function selectContact(element, email, checked) {
  checked = toggleSelectedContact(element, email, checked, editedTask);
  const arg1 = "'" + email + "'";
  const arg2 = "'" + checked + "'";
  element.setAttribute("onmousedown", `simulateClick(event ,this, ${arg1}, ${arg2})`);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(editedTask.assign_to);
}

/**
 * This function return the according string name for the path source of the icon.
 * @param {number} priority  0 - low, 1 - medium, 2 - urgent  .
 * @returns string name for the priority source path.
 */
function getTaskPriority(priority) {
  switch (priority) {
    case 0:
      return "low";
    case 1:
      return "medium";
    case 2:
      return "urgent";
    default:
      break;
  }
}

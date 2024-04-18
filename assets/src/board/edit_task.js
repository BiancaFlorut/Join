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
  getElementWithId("addSubtasksEditTask").onblur = function () {
    let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `<img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />`;
    getElementWithId("addSubtasksEditTask").value = "";
  };
}

/**
 * This function generates the html code for the contacts that are assigned to the task given as parameter.
 * @param {Array.<{name: string, email: string, phone: number, color: string}>} contacts
 * @param {} task for which the contacts are assigned to
 * @returns string as html code
 */
function getOptionForAssignedTo(contacts, task, exceptUserEmail) {
  let html = "";
  contacts.forEach((contact) => {
    if (contact.email != exceptUserEmail){
      let checked = "";
      if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
        checked = "_checked";
      }
    let logoHTML = getContactLogoForBigCardEditHTML(contact);
    html += /*html*/ `
        <div class="df_ac big_card_edit_contacts_select cursor_pointer" onmousedown="simulateClick(event, this, '${contact.email}', '${checked}')">${logoHTML}<span class="flex_1">${contact.name}</span><img id="${contact.email}Checkbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox"></div >
      `;
    }
  });
  return html;
}

async function saveEditedTask() {
  console.log(editedTask, '.. is now saving on the server');
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
  let newText = getElementWithId("addSubtasksEditTask").value;
  if (!isWhiteSpaceOnly(newText)) {
    const subtask = { text: newText, checked: false };
    editedTask.subtasks.push(subtask);
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
  scrollToTheBottomOfTheContainer(document.getElementsByClassName('big_card_edit_content_area')[0]);
  // editedTask.forEach((subtask, i) => setOnBlurFunctionOnEditedSubtask(i));
  cancelSubtaskEditInput();
}

/**
 * This function clears the blur event handler for the "addSubtasksEditTask" element,
 * and replaces the icons in "bigCardEditSubtaskInputIcons" container with edit mode icons. 
 * The input is focused and the user can type the new subtask.
 * @returns {void}
 */
function toggleEditTasksSubtasks() {
  getElementWithId("addSubtasksEditTask").onblur = "";
  getElementWithId("addSubtasksEditTask").focus();
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelSubtaskEditInput()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmSubtaskEditInput()">
    `;
}

/**
 * This function cancels the edit mode for the subtask input and sets blur function.
 */
function cancelSubtaskEditInput() {
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" onclick="toggleEditTasksSubtasks()"/>
    `;
  getElementWithId("addSubtasksEditTask").value = "";
  getElementWithId("addSubtasksEditTask").onblur = function () {
    let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
    iconsContainer.innerHTML = /*html*/ `
        <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />
    `;
    getElementWithId("addSubtasksEditTask").value = "";
  };
  getElementWithId("addSubtasksEditTask").blur();
}

function deleteEditTaskSubtask(id) {
  const i = getIndexFromId(id);
  editedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
}

function cancelSubtaskEditEditTask(id) {
  const i = getIndexFromId(id);
  cancelEditSubtask(id, i);
  const element = getElementWithId(id);
  element.innerHTML = editedTask.subtasks[i].text;
  element.blur();
}

function saveEditedSubtaskEditTask(id) {
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

/**
 *
 * @param {HTMLElement} element
 */
function editTasksSubtask(id) {
  let element = getElementWithId(id);
  const i = getIndexFromId(id);
  element.parentElement.classList.add("big_card_edit_subtask_on_edit");
  element.contentEditable = true;
  element.focus();
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
        <img src="../../img/delete.svg" alt="" onclick="cancelSubtaskEditEditTask('${id}', ${i})">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="saveEditedSubtaskEditTask('${element.id}')">
    `;
  getElementWithId(id).onmouseout = `showElement('bigCardEditCardIcons_${i}')`;
}

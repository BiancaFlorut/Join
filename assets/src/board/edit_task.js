let editedTask;
let allContacts;
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
  // do to: move the followings in the init function after the edit view is generated!!!!
  editedTask.subtasks.forEach((subtask, i) => {
    let element = getElementWithId(`bigCardEditCardSubtaskText_${i}`);
    element.onblur = () => {
      cancelSubtaskEdit(`bigCardEditCardSubtaskText_${i}`, i);
    };
  });
  getElementWithId("bigCardEdiSearchContact").ondblclick = function () {
    this.removeAttribute("readonly");
    this.value = "";
  };
}

async function saveEditedTask(){
    console.log('is title filled ',isTitelValid());
    console.log('is description filled? ', isDescriptionValid());
    console.log('is a date filled?', isDueDateValid());
    console.log(editedTask);
    await updateContactsAboutTask(editedTask);
    closeBigCardView();
    initBoard();
}

function isDueDateValid() {
    let dueDate = getElementWithId('editedTaskDueDateInput').value;
    if (!dueDate) {
        showElement('editedTaskDueDateInputError');
        return false;
    }
    else {
        hideElement('editedTaskDueDateInputError');
        const date = Date.parse(new Date(dueDate));
        editedTask.due_date = date;
        return true;
    }
    
}

function isDescriptionValid() {
    let description = getElementWithId('editedTaskDescriptionInput').value;
    if (!isWhiteSpaceOnly(description)) {
        editedTask.description = description;
        hideElement('editedTaskDescriptionInputError');
        return true;
    } 
    else {
        showElement('editedTaskDescriptionInputError');
        return false;
    }
}

function isTitelValid(){
    let title = getElementWithId('editedTaskTitleInput').value;
    if (!isWhiteSpaceOnly(title)) {
        editedTask.title = title;
        hideElement('editedTaskTitleInputError');
        return true;
    } 
    else {
        showElement('editedTaskTitleInputError');
        return false;
    }
}

function toggleEditTasksSubtasks() {
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img src="../../img/cancel.svg" alt="" onclick="cancelSubtaskEditInput()">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="confirmSubtaskEditInput()">
    `;
}

function confirmSubtaskEditInput() {
  let newText = getElementWithId("bigCardEditSubtaskInput").value;
  if (newText.length > 0) {
    const subtask = { text: newText, checked: false };
    editedTask.subtasks.push(subtask);
  } else {
    // delete the subtask
  }
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
  cancelSubtaskEditInput();
}

function cancelSubtaskEditInput() {
  let iconsContainer = getElementWithId("bigCardEditSubtaskInputIcons");
  iconsContainer.innerHTML = /*html*/ `
        <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/plus.svg" alt="" />
    `;
  getElementWithId("bigCardEditSubtaskInput").value = "";
  getElementWithId("bigCardEditSubtaskInput").blur();
}

function generateSubTaskListItems(subtasks) {
  let html = "";
  subtasks.forEach((subtask, i) => {
    html += /*html*/ `
        <li>
            <div class="df_ac big_card_edit_subtask">
            <span class="list_bullet">&bull;</span>    
            <span id="bigCardEditCardSubtaskText_${i}" ondblclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}', ${i})" class="flex_1">${subtask.text}</span>
                <div id="bigCardEditCardIcons_${i}" class="df_ac big_card_edit_subtask_icons">
                    <img src="../../img/edit.svg" alt="" onclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
                    <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
                    <img src="../../img/delete.svg" alt="" onclick="deleteEditTaskSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
                </div>
            </div>
        </li>
        `;
  });
  return html;
}

function deleteEditTaskSubtask(id, i) {
  let element = getElementWithId(id);
  editedTask.subtasks.splice(i, 1);
  getElementWithId("bigCardEditSubtasks").innerHTML = generateSubTaskListItems(editedTask.subtasks);
}

/**
 *
 * @param {HTMLElement} element
 */
function editTasksSubtask(id, i) {
  let element = getElementWithId(id);
  element.onblur = "";
  element.parentElement.classList.add("big_card_edit_subtask_on_edit");
  element.focus();
  element.contentEditable = true;
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
        <img src="../../img/delete.svg" alt="" onclick="cancelSubtaskEdit('${id}', ${i})">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/confirm.svg" alt="" onclick="saveEditedSubtask('${element.id}')">
    `;
}

function cancelSubtaskEdit(id, i) {
  let element = getElementWithId(id);
  element.parentElement.classList.remove("big_card_edit_subtask_on_edit");
  element.contentEditable = false;
  getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
    <img src="../../img/edit.svg" alt="" onclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
    <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
    <img src="../../img/delete.svg" alt="" onclick="deleteEditTaskSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
    `;
  element.innerHTML = editedTask.subtasks[i].text;
  element.onblur = () => {
    cancelSubtaskEdit(id, i);
  };
  element.blur();
}

function saveEditedSubtask(id) {
  const subtaskIndex = id.split("_");
  const i = subtaskIndex[1];
  if (getElementWithId(id).innerHTML.length > 0) {
    editedTask.subtasks[i].text = getElementWithId(id).innerHTML;
    getElementWithId(id).parentElement.classList.remove("big_card_edit_subtask_on_edit");
    getElementWithId(id).blur();
    getElementWithId(id).contentEditable = false;
    getElementWithId("bigCardEditCardIcons_" + i).innerHTML = /*html*/ `
        <img src="../../img/edit.svg" alt="" onclick="editTasksSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
        <img src="../../img/vertical_line_subtask.svg" alt="" style="cursor: auto">
        <img src="../../img/delete.svg" alt="" onclick="deleteEditTaskSubtask('bigCardEditCardSubtaskText_${i}', ${i})">
    `;
     getElementWithId(id).onblur = () => {
        cancelSubtaskEdit(id, i);
      };
      getElementWithId(id).blur();
  } else deleteEditTaskSubtask(id, i);
}

function toggleContactsList(element) {
  if (istContactListOpen) {
    changeSrc(element, "../../img/arrow_drop_down_down.svg");
    getElementWithId("bigCardEditContacts").classList.add("d_none");
    istContactListOpen = false;
  } else {
    changeSrc(element, "../../img/arrow_drop_down_up.svg");
    getElementWithId("bigCardEditContacts").classList.remove("d_none");
    istContactListOpen = true;
  }
}

function searchContact() {
  getElementWithId("bigCardEdiSearchContact").onblur = "";
  toggleContactsList(getElementWithId("bigCardEdiSearchIcon"));
  const searchToken = getElementWithId("bigCardEdiSearchContact").value;
  const foundContacts = allContacts.filter((contact) => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
  let container = getElementWithId("bigCardEditContacts");
  container.innerHTML = getOptionForAssignedTo(foundContacts, editedTask);
}

function getPriorityButtonsClasses(priority) {
  switch (priority) {
    case 0:
      return "low clicked";
    case 1:
      return "medium clicked";
    case 2:
      return "urgent clicked";
    default:
      return "";
  }
}

function togglePriorityTo(priorityValue, buttonElement) {
  editedTask.priority = priorityValue;
  resetPriorityButtons();
  let classList = getPriorityButtonsClasses(priorityValue).split(" ");
  buttonElement.classList.add(...classList);
}

function getOptionForAssignedTo(contacts, task) {
  let html = "";
  contacts.forEach((contact) => {
    let checked = "";
    if (task.assign_to.some((assignToContact) => assignToContact.email == contact.email)) {
      checked = "_checked";
    }
    let logoHTML = getContactLogoForBigCardEditHTML(contact);
    html += /*html*/ `
        <div class="df_ac big_card_edit_contacts_select" onclick="selectContact(this, '${contact.email}', '${checked}')">${logoHTML}<span class="flex_1">${contact.name}</span><img id="${contact.email}Checkbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox"></div >
      `;
  });
  return html;
}

function getContactsLogoHTML(contacts) {
  let html = "";
  contacts.forEach((contact) => (html += getContactLogoForBigCardEditHTML(contact)));
  return html;
}

function getContactLogoForBigCardEditHTML(contact) {
  return /*html*/ `
    <div class='contacts_icon big_card_edit_contact_icons' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    `;
}

function resetPriorityButtons() {
  for (let i = 0; i < 3; i++) {
    let classList = getElementWithId("buttonPriority" + i).classList;
    classList.remove("clicked");
    classList.remove(getTaskPriority(i));
  }
}

/**
 * This function selects an contact and add it in the editTask.assigned_to toggles the look and the checkbox
 * @param {HTMLDivElement} element
 * @param {string} email
 * @param {string} checked
 */
function selectContact(element, email, checked) {
  const contact = allContacts.find((c) => c.email == email);
  toggleSelectedContact(element, email, checked, contact);
  const arg1 = "'" + email + "'";
  const arg2 = "'" + checked + "'";
  element.setAttribute("onclick", `selectContact(this, ${arg1}, ${arg2})`);
  getElementWithId("editAssignToIconsList").innerHTML = getContactsLogoHTML(editedTask.assign_to);
  getElementWithId("bigCardEdiSearchContact").onblur = function () {
    this.value = "Select contacts to assign";
    this.setAttribute("readonly", "");
    getElementWithId("bigCardEditContacts").innerHTML = getOptionForAssignedTo(allContacts, editedTask);
  };
}

function toggleSelectedContact(element, email, checked, contact) {
    if (checked == "_checked") {
        toggleCheckbox(getElementWithId(`${email}Checkbox`), true, CHECKBOX_PATH);
        checked = "";
        element.classList.remove("big_card_edit_contact_clicked");
        const index = editedTask.assign_to.findIndex((c) => c.email == email);
        editedTask.assign_to.splice(index, 1);
      } else {
        toggleCheckbox(getElementWithId(`${email}Checkbox`), false, CHECKBOX_PATH + "_white");
        element.classList.add("big_card_edit_contact_clicked");
        editedTask.assign_to.push(contact);
        checked = "_checked";
      }
}

let editedTask;
let allContacts;
let istContactListOpen = false;

function editTask(taskId) {
    let container = getElementWithId('bigCardContent');
    editedTask = tasks.find( t => t.id == taskId);
    const priorityClass = getPriorityButtonsClasses(editedTask.priority);
    const due_date = new Date(editedTask.due_date);
    const valueDate = due_date.toISOString().split('T')[0];
    const minDateValue = new Date().toISOString().split('T')[0];
    let priorityClasses = ['', '', ''];
    priorityClasses[editedTask.priority] = priorityClass;
    container.innerHTML = /*html*/`
      <div class="big_card_header" style="justify-content: flex-end">
        <div class="close_icon" onclick="closeBigCardView()">
          <img src="../../img/close_black.svg" alt="close">
        </div>
      </div>
      <div class="big_card_edit_content_area">
        <div class='big_card_edit_input_area'>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Title</span>
            <input class='big_card_edit_title_input' type="text" value="${editedTask.title}">
            <span class="big_card_edit_error d_none">This field is required</span>
          </div>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Description</span>
            <textarea class='big_card_edit_description_textarea'>${editedTask.description}</textarea>
            <span class="big_card_edit_error d_none">This field is required</span>
          </div>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Due Date</span>
            <input type='date' value="${valueDate}" min="${minDateValue}" class='big_card_edit_title_input'>
            <span class="big_card_edit_error d_none">This field is required</span>
          </div>
        </div>
        <div class="big_card_edit_input_area">
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header_priority">Priority</span>
            <div class="big_card_edit_priority_buttons df_ac">
              <button id="buttonPriority2" class="button_priority flex_1_1_0px df_ac jc ${priorityClasses[2]}" onclick="togglePriorityTo(2, this)">
                <span>Urgent</span>
                <img src="../../img/priority_urgent.svg" alt="">
              </button>
              <button id="buttonPriority1" class="button_priority flex_1_1_0px df_ac jc ${priorityClasses[1]}" onclick="togglePriorityTo(1, this)">
                <span>Medium</span>
                <img src="../../img/priority_medium.svg" alt="">
              </button>
              <button id="buttonPriority0" class="button_priority flex_1_1_0px df_ac jc ${priorityClasses[0]}" onclick="togglePriorityTo(0, this)">
                <span>Low</span>
                <img src="../../img/priority_low.svg" alt="">
              </button>
            </div>
          </div>
        </div>
        <div>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Assigned to</span>
            <div class='big_card_edit_assigned_to_custom_select'>
              <div class="big_card_edit_assigned_to_content">
                <input id="bigCardEdiSearchContact" type="text" class='big_card_edit_title_input' value='Select contacts to assign' readonly="readonly" onkeyup="searchContact()"/>
                <div class="visibility_area_container df_ac">
                    <div class="visibility_icon_container">
                      <img class="visibility_icon" src="../../img/arrow_drop_down_down.svg" onclick="toggleContactsList(this)" alt="" />
                    </div>
                  </div>
                <div id="bigCardEditContacts" class='big_card_edit_contacts df_ac d_none'> `
                  + getOptionForAssignedTo(allContacts, editedTask) + /*html*/`
                </div>
              </div>
            </div>
            <div id="editAssignToIconsList" class="big_card_edit_assigned_to_logos df_ac">`
              + getContactsLogoHTML(editedTask.assign_to) + /*html*/`
            </div>
          </div>
        </div>
      </div>
    `;
    let element = getElementWithId('bigCardEdiSearchContact');
    element.ondblclick = function(){
        this.removeAttribute('readonly');
        this.value = '';
      };
      element.onblur = function(){
        this.value = 'Select contacts to assign';
        this.setAttribute('readonly', '');
        getElementWithId('bigCardEditContacts').innerHTML = getOptionForAssignedTo(allContacts, editedTask);
      };
  }

  function toggleContactsList(element){
    if (istContactListOpen) {
        changeSrc(element, "../../img/arrow_drop_down_down.svg");
        getElementWithId('bigCardEditContacts').classList.add('d_none');
        istContactListOpen = false;
    } else {
        changeSrc(element, "../../img/arrow_drop_down_up.svg");
        getElementWithId('bigCardEditContacts').classList.remove('d_none');
        istContactListOpen = true;
    }
    
  }

  function searchContact() {
    const searchToken = getElementWithId('bigCardEdiSearchContact').value;
    const foundContacts = allContacts.filter(contact => contact.name.toLowerCase().includes(searchToken.toLowerCase()));
    let container = getElementWithId('bigCardEditContacts');
    container.innerHTML = getOptionForAssignedTo(foundContacts, editedTask);
  }

  function toggleSearchInput(){

  }

  function getPriorityButtonsClasses(priority) {
    switch (priority) {
      case 0: return 'low clicked';
      case 1: return 'medium clicked';
      case 2: return 'urgent clicked';
      default:
        return '';
    }
  }

  function togglePriorityTo(priorityValue, buttonElement) {
    editedTask.priority = priorityValue;
    resetPriorityButtons();
    let classList = getPriorityButtonsClasses(priorityValue).split(' ');
    buttonElement.classList.add(...classList);
  }

  function getOptionForAssignedTo(contacts, task) {
    let html = '';
    contacts.forEach( (contact) => {
      let checked = '';
      if (task.assign_to.some( assignToContact => assignToContact.email == contact.email)) {
        checked = '_checked';
      }
      let logoHTML = getContactLogoForBigCardEditHTML(contact);
      html += /*html*/`
        <div class="df_ac big_card_edit_contacts_select" onclick="selectContact(this, '${contact.email}', '${checked}')">${logoHTML}<span class="flex_1">${contact.name}</span><img id="${contact.email}Checkbox" src="${CHECKBOX_PATH}${checked}.svg" alt="checkbox"></div >
      `
    });
    return html;
  }

  function getContactsLogoHTML(contacts) {
    let html = '';
    contacts.forEach( contact => html += getContactLogoForBigCardEditHTML(contact));
    return html;
  }
  
  function getContactLogoForBigCardEditHTML(contact) {
    return /*html*/`
    <div class='contacts_icon big_card_edit_contact_icons' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    `;
  }
  
  function resetPriorityButtons() {
    for (let i = 0; i < 3; i++) {
      let classList = getElementWithId('buttonPriority' + i).classList;
      classList.remove('clicked');
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
    const contact = allContacts.find(c => c.email == email);
    if (checked == '_checked') {
        toggleCheckbox(getElementWithId(`${email}Checkbox`), true, CHECKBOX_PATH);
        checked = '';
        element.classList.remove('big_card_edit_contact_clicked');
        const index = editedTask.assign_to.findIndex(c => c.email == email);
        editedTask.assign_to.splice(index, 1);
    } else {
        toggleCheckbox(getElementWithId(`${email}Checkbox`), false, CHECKBOX_PATH + '_white');
        element.classList.add('big_card_edit_contact_clicked');
        editedTask.assign_to.push(contact);
        checked = '_checked';
    }
    const arg1 = "'" + email + "'" ;
    const arg2 = "'" + checked+ "'";
    element.setAttribute("onclick", `selectContact(this, ${arg1}, ${arg2})`);
    getElementWithId('editAssignToIconsList').innerHTML = getContactsLogoHTML(editedTask.assign_to);
  }
function generateEditedTaskHTML(valueDate, minDateValue, priorityClasses) {
  return (
    /*html*/ `
      <div class="big_card_header" style="justify-content: flex-end">
        <div class="close_icon" onclick="closeBigCardView()">
          <img src="../../img/close_black.svg" alt="close">
        </div>
      </div>
      <div class="big_card_edit_content_area">
        <div class='big_card_edit_input_area'>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Title</span>
            <input id="editedTaskTitleInput" class='big_card_edit_title_input' type="text" value="${editedTask.title}" onchange="isTitelValid()">
            <span id="editedTaskTitleInputError" class="big_card_edit_error d_none">This field is required</span>
          </div>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Description</span>
            <textarea id="editedTaskDescriptionInput" class='big_card_edit_description_textarea' onchange="isDescriptionValid()">${editedTask.description}</textarea>
            <span id="editedTaskDescriptionInputError" class="big_card_edit_error d_none">This field is required</span>
          </div>
          <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Due Date</span>
            <input id="editedTaskDueDateInput" type='date' value="${valueDate}" min="${minDateValue}" class='big_card_edit_title_input' onchange="isDueDateValid()">
            <span id="editedTaskDueDateInputError" class="big_card_edit_error d_none">This field is required</span>
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
                        <input id="bigCardEdiSearchContact" type="text" class='big_card_edit_title_input' value='Select contacts to assign' readonly="readonly" onkeyup="searchContact()" onclick="setToggleForTheContactList()"/>
                        <div class="visibility_area_container df_ac">
                            <div class="visibility_icon_container">
                                <img id="bigCardEdiSearchIcon" class="visibility_icon" src="../../img/arrow_drop_down_down.svg"  alt="" onclick="setToggleForTheContactList()"/>
                            </div>
                        </div>
                        <div id="bigCardEditContacts" class='big_card_edit_contacts df_ac d_none'> ` +
    getOptionForAssignedTo(user.contacts, editedTask, user.email) +
    /*html*/ `
                        </div>
                    </div>
                </div>
                <div id="editAssignToIconsList" class="big_card_edit_assigned_to_logos df_ac">` +
    getContactsLogoHTML(editedTask.assign_to) +
    /*html*/ `
                </div>
            </div>
        </div>
        <div class="big_card_edit_title">
            <span class="big_card_edit_title_header">Subtasks</span>
            <input id="addSubtasks" class='big_card_edit_title_input cursor_pointer' onfocus="toggleEditTasksSubtasks()" placeholder='Add new subtask' type="text">
            <div class="visibility_area_container df_ac">
                <div id="bigCardEditSubtaskInputIcons" class="visibility_icon_container df_ac big_card_edit_subtask_input_icons">
                    <img class="visibility_icon" src="../../img/plus.svg" alt="" />
                </div>
            </div>
            <ul id="bigCardEditSubtasks" class="big_card_edit_subtask_list">` +
    generateSubTaskListItems(editedTask.subtasks) +
    /*html*/ `
            </ul>
          </div>
        </div>
        <div class="big_card_edit_ok_button">
            <button class="bold_21 df_ac" onclick="saveEditedTask()"><span>Ok</span><img src="../../img/confirm_white.svg" alt="confirm"></button>
        </div>
    `
  );
}

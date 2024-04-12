function openTask(id) {
    showElement('bigCardView');
    let container = getElementWithId('bigCardContent');
    const task = tasks.find( t => t.id == id);
    const d = new Date(task.due_date);
    const formattedDate = d.toLocaleDateString('de-De').replaceAll('.', '/');
    const priority = getTaskPriority(task.priority);
    container.innerHTML = /*html*/`
      <div class="big_card_header">
        <div class='big_card_category ${getCategoryClassColor(task.category)}'>${task.category}</div>
        <div class="close_icon" onclick="closeBigCardView()">
          <img src="../../img/close_black.svg" alt="close">
        </div>
      </div>
      <h1>${task.title}</h1>
      <span>${task.description}</span>
      <div>
        <span class="big_card_title">Due Date:</span>
        <span>${formattedDate}</span>
      </div>
      <div class='df_ac'>
        <span class="big_card_title">Priority:</span>
        <div class='priority_area' >
          <span class="pr_10" style="text-transform: capitalize;">${priority}</span>
          <img src="../../img/priority_${priority}.svg" alt="">
        </div>
      </div>
      <div class="big_card_assigned_to_area">
        <span class="big_card_title">Assigned To:</span>
        <div class="big_card_assigned_to_list">`
          + getAssignedToHTML(task.assign_to) +/*html*/`
        </div>
      </div>
      <div class="big_card_assigned_to_area">
        <span class="big_card_title">Subtasks</span>
        <div class="big_card_assigned_to_list">`
          + getSubTaskForBigCardHTML(task) +/*html*/`
        </div>
      </div>
      <div class='big_card_footer df_ac'>
        <div class='big_card_change df_ac' onmouseover="changeIdImgTheSrc('deleteIcon', '../../img/delete_blue.svg')" onmouseout="changeIdImgTheSrc('deleteIcon', '../../img/delete.svg')">
          <img id="deleteIcon" src="../../img/delete.svg" alt="delete">
          <span>Delete</span>
        </div>
        <img src="../../img/input_vertical_line.svg" alt="">
        <div class='big_card_change df_ac' onclick="editTask('${task.id}')" onmouseover="changeIdImgTheSrc('editIcon', '../../img/edit_blue.svg')" onmouseout="changeIdImgTheSrc('editIcon', '../../img/edit.svg')">
          <img id="editIcon" src="../../img/edit.svg" alt="edit">
          <span>Edit</span>
        </div>
      </div>
    `;
  }
  
  function getSubTaskForBigCardHTML(task) {
    let subtasks = task.subtasks;
    let html = '';
    subtasks.forEach(function (subtask, index) {
      const checkbox = subtask.checked ? SUBTASK_CHECKBOX_PATH +'_checked.svg' : SUBTASK_CHECKBOX_PATH + '.svg';
      html += /*html*/`
        <div class="big_card_subtask_area df_ac">
          <img src="${checkbox}" alt="checkbox" onclick="toggleSubtaskCheckbox(this, '${task.id}', ${index})">
          <span>${subtask.text}</span>
        </div>`;
    });
    return html;
  }
  
  function getAssignedToHTML(array) {
    let html = '';
    array.forEach(contact => html += getContactForBigCardHTML(contact));
    return html;
  }
  
  function getContactForBigCardHTML(contact) {
    let you = contact.name == user.name ? ' (You)' : ''; 
    return /*html*/`
      <div class='big_card_assigned_to'>`
        + getContactLogoHTML(contact) + /*html*/`  
        <div>${contact.name + you}</div>
      </div>
    `;
  }
  
  function getContactLogoHTML(contact) {
    return /*html*/`
      <div class='contacts_icon' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    `;
  }
  
  function closeBigCardView(){
    editedTask = [];
    hideElement('bigCardView');
  }
  
  function changeIdImgTheSrc(id, src) {
    changeSrc(getElementWithId(id), src);
  }
  
  function toggleSubtaskCheckbox(element, taskId, i) {
    let taskIndex = tasks.findIndex(t => t.id == taskId);
    let task = tasks.find((t, index) => t.id == taskId);
    let isChecked = task.subtasks[i].checked;
    tasks[taskIndex].subtasks[i].checked = toggleCheckbox(element, isChecked, SUBTASK_CHECKBOX_PATH);
    //change the task for the assigned to contacts.
    updateTasksFromUser(emailParameter, tasks);
    updateContactsAboutTask(task.assign_to, tasks[taskIndex]);
    updateHTML(tasks);
  }
let contacts = [];
let firstLetter = [];

async function initContacts() {
    contacts = await getContactList(emailParameter);
    getFirstLetterArray(contacts);
    firstLetter.sort();
    contactListHTML();
    initContactButtons();
}

function initContactButtons(){
    let btns = document.getElementsByClassName("contact_name");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
          let current = document.getElementsByClassName("active");
          if (current.length > 0)
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
    }
}

/**
 * Generates the HTML content for the contact list and appends it to the 'content' element.
 *
 * @return {void} This function does not return a value.
 */
function contactListHTML() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    firstLetter.forEach(letter => {
        const contactsFirstLetter = contacts.filter(contact => contact.name.charAt(0).toUpperCase() == letter);
        content.innerHTML += /*html*/`
            <div>
                <div class="contact_letter">${letter}</div>
                 `;
        contactsFirstLetter.forEach(contact => {
            content.innerHTML += /*html*/`
                <button id="${contact.email}" onclick="showContactDetails('${contact.email}')" class="contact_name">
                    <div class="profile_badge" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
                    <div>
                        <span><b>${contact.name}</b></span><br>
                        <span class="light_blue">${contact.email}</span>
                    </div>
                </button>    
                <div></div>`;
        });
        content.innerHTML += `</div>`;
    });
}

function getFirstLetterArray(array) {
    firstLetter = [];
    for (let i = 0; i < array.length; i++) {
        const letter = array[i].name.charAt(0).toUpperCase();
        if (!firstLetter.includes(letter)) {
            firstLetter.push(letter);
        }
    }
}

function showContactDetails(email) {
    const contact = contacts.find(c=>c.email==email);
    document.getElementById('infoContact').style.display='flex';
    document.getElementById('infoContact').innerHTML = /*html*/`
    <div class="contact_info_card">
        <div class="contact_name_info">
            <div class="profile_contact" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
            <div class="contact_info_container">
                <div class="contact_info_name">${contact.name}</div>
                    <div class="icon_container">
                        <div class="edit_info_contact" onclick="editContact('${contact.email}')">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_75601_14818" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_75601_14818)">
                                <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
                            </g>
                        </svg>
                        <p>Edit</p></div>
                        <div class="edit_info_contact" onclick="deleteContact('${contact.email}')">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_75601_14820" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                                <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_75601_14820)">
                                <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
                            </g>
                        </svg>
                        <p>Delete</p>
                    </div>   
                </div>
            </div>    
        </div>
        <span class="contact_info">Contact Information</span>
        <h3 class="email_header">Email</h3>
        <div class="email_contact">${contact.email}</div>
        <h3 class="phone_header">Phone</h3>
        <div class="phone_contact">${contact.phone}</div>
    </div>
    `;
}

function editContact(email) {
    const contact = contacts.find(c=>c.email==email);
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('overlayEditContact').style.display='flex';
    document.getElementById('overlayAddContact').style.display='none';
    document.getElementById('contactSucces').style.display='none';
    document.getElementById('editName').value = `${contact.name}`;
    document.getElementById('editEmail').value = `${contact.email}`;
    document.getElementById('editPhone').value = `${contact.phone}`;
    getElementWithId('editContactBigLogo').innerHTML = generateEditContactBigLogoHTML(contact);
    getElementWithId('editContact').setAttribute('onsubmit', `updateContact('${contact.email}'); return false`);
    getElementWithId('editContactDeleteButton').setAttribute('onclick', `deleteContact('${contact.email}')`);
}

function generateEditContactBigLogoHTML(contact) {
    return /*html*/`
    <div class="edit_contact_big_logo">
        <div class="profile_contact" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    </div>
    `
}

async function updateContact(contactEmail) {
    getElementWithId('editContactButton').disabled = true;
    let contactIndex = contacts.findIndex(c=>c.email==contactEmail);
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const color = contacts[contactIndex].color;
    contacts[contactIndex] = { name: name, email: email, phone: phone, color: color};
    await updateUserContactsToRemoteServer(emailParameter, contacts);
    hideEditContact();
    initContacts();
    showContactDetails(email);
    getElementWithId('createContactButton').disabled = false;
}

function checkEmail(inputElement) {
    const email = inputElement.value;
    contacts.forEach(contact => {
        if (contact.email === email) {
            inputElement.setCustomValidity('Email already exists');
            inputElement.reportValidity();
        }
    })
}

function checkName(inputElement) {
    const name = inputElement.value;
    if (isWhiteSpaceOnly(name)) {
        inputElement.setCustomValidity('Name cannot be empty');
    }
}

function hideEditContact() {
    getElementWithId('overlayEditContact').style.display='none';
    document.getElementById('overlyContact').style.display='none';
}

function showCreateContactForm() {
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('overlayEditContact').style.display='none';
    getElementWithId('overlayAddContact').style.display='flex';
}

async function addNewContact() {
    getElementWithId('createContactButton').disabled = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const color = selectRandomColor();
    const newContact = { name: name, email: email, phone: phone, color: color};
    contacts.push(newContact);
    await updateUserContactsToRemoteServer(emailParameter, contacts);
    addClose();
    getElementWithId('createContactButton').disabled = false;
    showToastMessage();
    initContacts();
}

async function deleteContact(email) {
    getElementWithId('editContactDeleteButton').disabled = true;
    const indexToDelete = contacts.findIndex(contact => contact.email === email);
    if (indexToDelete !== -1) {
        contacts.splice(indexToDelete, 1);
        getElementWithId('infoContact').innerHTML = '';
        await deleteAssignedToFromAllTasks(email);
        await updateUserContactsToRemoteServer(emailParameter, contacts);
        hideEditContact();
        initContacts();
    } else {
        console.error('Kontakt mit der E-Mail-Adresse ' + email +' nicht gefunden.');
    }
    getElementWithId('editContactDeleteButton').disabled = false;
}

async function deleteAssignedToFromAllTasks(email) {
    user = await getUserFromServer(emailParameter);
    for (let task of user.tasks) {
        for (let contact of task.assign_to) {
            if (contact.email === email) {
                task.assign_to.splice(task.assign_to.indexOf(contact), 1);
                await updateContactsAboutTask(task);
            }
        }
    }
}

function showToastMessage() {
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('contactSucces').style.display='flex';
    getElementWithId('overlayAddContact').style.display='none';
    setTimeout(function() { document.getElementById('overlyContact').style.display='none'; }, 2500);
}


function addClose() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('overlyContact').style.display='none';
}

function toggleContainerDisplay() {
    let container = document.getElementById('overlayEditContact');
    if (window.innerWidth <= 1255) {
       container.style.display = 'block';
    } else {
       container.style.display = 'flex';
    }
   }
   
   // Führen Sie die Funktion beim Laden der Seite und beim Ändern der Fenstergröße aus
   window.addEventListener('load', toggleContainerDisplay);
   window.addEventListener('resize', toggleContainerDisplay);
let contacts = [];
let firstLetter = [];

async function initContacts() {
    contacts = await getContactList(emailParameter);
    contactListHTML();
    firstLetter = getFirstLetterArray(contacts);
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
        const contactsFirstLetter = contacts.filter(contact => contact.name.charAt(0) == letter);
        content.innerHTML += /*html*/`
            <div>
                <div class="contact_letter">${letter}</div>
                <div>
                    <img src="../../img/contacts_add-new-vector.svg" alt="partition_wall">
                </div>   `;
        contactsFirstLetter.forEach(contact => {
            content.innerHTML += /*html*/`
                <div onclick="contactName('${contact.email}')" class="contact_name">
                    <div class="profile_badge" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
                    <div>
                        <span><b>${contact.name}</b></span><br>
                        <span class="light_blue">${contact.email}</span>
                    </div>
                </div>    
                <div></div>`;
        });
        content.innerHTML += `</div>`;
    });
    // for (let i = 0; i < contacts.length; i++) {
    //     const contact = contacts[i];
    //     content.innerHTML += `
    //     <div>
    //     <div class="contact_letter">${firstLetter[i]}</div>
    //     <div>
    //         <img src="../../img/contacts_add-new-vector.svg" alt="partition_wall">
    //     </div>    
    //     <div onclick="contactName('${contact.email}')" class="contact_name">
    //     <div class="profile_badge" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
    //         <div>
    //             <span><b>${contact.name}</b></span><br>
    //             <span class="light_blue">${contact.email}</span>
    //         </div>
    //     </div>    
    //     <div></div>
    //     </div>
    //     `;
    // }
}

function getFirstLetterArray(array) {
    for (let i = 0; i < array.length; i++) {
        const letter = array[i].name.charAt(0).toUpperCase();

        if (!firstLetter.includes(letter)) {
            firstLetter.push(letter);
        }
        
    }
    contactListHTML()
}

function contactName(email) {
    const contact = contacts.find(c=>c.email==email);
    document.getElementById('infoContact').style.display='flex';
    document.getElementById('infoContact').innerHTML = `
    <div class="contact_info_card">
        <div class="contact_name_info">
            <div class="profile_contact" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
            <div class="contact_info_container">
                <div class="contact_info_name">${contact.name}</div>
                    <div class="icon_container">
                    <img onclick="editContact('${contact.email}')" class="edit_delet" src="../../img/edit.svg"><p>Edit</p>
                    <img onclick="deleteContact('${contact.email}')" class="edit_delet" src="../../img/delete.svg"><p>Delete</p>
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

async function editContact(email) {
    const contact = contacts.find(c=>c.email==email);
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('overlayEditContact').style.display='flex';
    document.getElementById('overlayAddContact').style.display='none';
    document.getElementById('contactSucces').style.display='none';
    document.getElementById('editName').value = `${contact.name}`;
    document.getElementById('editEmail').value = `${contact.email}`;
    document.getElementById('editPhone').value = `${contact.phone}`;
    
    console.log(contact);
    await updateUserContactsToRemoteServer(emailParameter, contacts);
    contactListHTML();
}

function addContact() {
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('overlayEditContact').style.display='none';
    document.getElementById('contactSucces').style.display='none';
    contactListHTML();
}

async function addNewContact() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const color = selectRandomColor();
    const newContact = { name: name, email: email, phone: phone, color: color};
    contacts.push(newContact);
    await updateUserContactsToRemoteServer(emailParameter, contacts);
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    contactListHTML();
}

async function deleteContact(email) {
    const indexToDelete = contacts.findIndex(contact => contact.email === email);
    if (indexToDelete !== -1) {
        contacts.splice(indexToDelete, 1);
        console.log('Kontakt erfolgreich gelöscht und Kontakt verschoben:', contacts);
    } else {
        console.error('Kontakt mit der E-Mail-Adresse ' + email +' nicht gefunden.');
    }
    await updateUserContactsToRemoteServer(emailParameter, contacts);
    contactListHTML();
    contactName();
}

function contactSuccesfully() {
    document.getElementById('overlyContact').style.display='none';
    document.getElementById('contactSucces').style.display='flex';
}


function addClose() {
    document.getElementById('overlyContact').style.display='none';
}
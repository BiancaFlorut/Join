let contacts = [];
let firstLetter = [];

async function initContacts() {
    contacts = await getContactList(emailParameter);
    contactListHTML();
    firstLetter = getFirstLetterArray(contacts);
}

function contactListHTML() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        content.innerHTML += `
        <div>
        <div></div>
        <img src="../../img/contacts_add-new-vector.svg" alt="partition_wall">
        <div onclick="contactName()" class="contact_name">
        <div class="profile_badge" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
            <div>
                <span><b>${contact.name}</b></span><br>
                <span class="light_blue">${contact.email}</span>
            </div>
        </div>    
        <div></div>
        </div>
        `;
    }
}

function getFirstLetterArray(array) {
    for (let i = 0; i < array.length; i++) {
        const letter = array[i].name.charAt(0);

        if (!firstLetter.includes(letter)) {
            firstLetter.push(letter);
        }
        
    }
}

function contactName() {
    document.getElementById('infoContact').style.display='flex';
    document.getElementById('infoContact').innerHTML = `
    <div>
        <div></div>
        <span>Contact Information</span>
        <h3>Email</h3>
        <div></div>
        <h3>Phone</h3>
        <div></div>
    </div>
    `;
}

function addContact() {
    document.getElementById('overlyContact').style.display='flex';
    document.getElementById('overlayEditContact').style.display='none';
}

function addClose() {
    document.getElementById('overlyContact').style.display='none';
}

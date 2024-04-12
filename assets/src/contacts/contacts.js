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
        const email = contacts[i];
        content.innerHTML += `
        <div>
        <div class='deine classe' style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
        <div>${email.name}</div>
        <img src="../../img/contacts_add-new-vector.svg" alt="partition_wall">
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
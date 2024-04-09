let contacts = [];

function contactList() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        content.innerHTML += `
        <div class="contact_card">
        <button class="contact_button_add_new bold_21">Add new contact<img src="../../img/contacts_person_add.svg" alt="person_add"></button>

        </div>
        `;
        
    }
}
let users;

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = user.find(u => u.email == email.value && u.password == password.value);
}

const urlParms = new URLSearchParams(window.location.search);
const msg = urlParms.get('msg');

if (msg) {
    msgBox.innerHTML = msg;
} else {
    //display:none
}
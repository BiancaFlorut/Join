let users;
let isPasswordVisible = false;
let isRememberMeChecked = false;

function togglePasswordSignIn(element, id) {
  isPasswordVisible = togglePassword(element, id, isPasswordVisible);
}

function toggleRememberMe(checkbox) {
    isRememberMeChecked = toggleCheckbox(checkbox, isRememberMeChecked);
}

function mouseOverRememberMe(element) {
  mouseOver(element, isRememberMeChecked);
}

function mouseBesideRememberMe(element) {
  mouseBeside(element, isRememberMeChecked);
}

async function logIn() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find((u) => u.email == email.value && u.password == password.value);
  if (user) {
    console.log(user);
    setItemToRemoteStorage('actualUser', JSON.stringify(user));
    const response = await getItemFromRemoteStorage('actualUser');
    console.log(response);
    window.location.replace('../../summary/summary.html?email='+user.email);
  }
  else {
    getElementWithId('errorPasswordMessage').classList.remove('d_none');
    getElementWithId('password').style.border = '1px solid rgba(255, 0, 31, 1)';
  }
}
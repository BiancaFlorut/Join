const STORAGE_TOKEN = "A4FWT6VNANE57F3YJWY8RKAO2BLJ7XU20BKY7G0X";
const STORAGE_URL = " https://remote-storage.developerakademie.org/item";

/**
 * The function calls the remote saved data with the key parameter.
 *
 * @param {string} key
 * @returns the value of the saved data with the key and token in json data structure {data, value, status}
 */
async function getItemFromRemoteStorage(key) {
  const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return await fetch(URL).then((resp) => resp.json());
}

/**
 * The function saves data with the pair key value on the remote server.
 *
 * @param {string} key
 * @param {JSON} value
 * @returns {Promise}
 */
async function setItemToRemoteStorage(key, value) {
  const payload = { key: key, value: value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) });
}

/**
 * This function calls all the users form server and returns them.
 * @returns JSON array
 */
async function loadUsersFromServer() {
  const response = await getItemFromRemoteStorage("users");
  let users = JSON.parse(response.data.value);
  return users;
}

async function getUserFromServer(email) {
  let users = await loadUsersFromServer();
  let user = users.find((u) => u.email == email);
  return user;
}

async function getTaskList(email) {
  let user = await getUserFromServer(email);
  return user.tasks;
}

async function getContactList(email) {
  let user = await getUserFromServer(email);
  return user.contacts;
}

/**
 * This function sets the given array as a JSON array in the remote server with the key 'users'.
 * @param {JSON array} server response
 */
async function setUsersOnRemoteServer(array) {
  return await setItemToRemoteStorage("users", array);
}

async function updateTasksFromUser(userEmail, tasks) {
  let user = await getUserFromServer(userEmail);
  let users = await loadUsersFromServer();
  let index = users.findIndex((u) => u.email == userEmail);
  console.log("the index of: ", userEmail, " is ", index);
  user.tasks = tasks;
  users[index] = user;
  setUsersOnRemoteServer(users);
}

async function updateContactsAboutTask(newTask) {
  let users = await loadUsersFromServer();
  let contacts = newTask.assign_to;
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    const contact = contacts[indexContact];
    const userIndex = users.findIndex((u) => u.email == contact.email);
    if (userIndex >= 0) {
      let user = users[userIndex];
      const taskIndex = user.tasks.findIndex((t) => t.id == newTask.id);
      if (taskIndex >= 0) {
        user.tasks[taskIndex] = newTask;
        await updateUserToRemoteServer(user);
      } else {
        user.tasks.push(newTask);
        await updateUserToRemoteServer(user);
      }
    }
  }
}

async function deleteTaskFromAssignedToUsers(contacts, id) {
  let users = await loadUsersFromServer();
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    const contact = contacts[indexContact];
    let user = users.find((u) => u.email == contact.email);
    if (user) {
      const taskIndex = user.tasks.findIndex((t) => t.id == id);
      if (taskIndex >= 0) {
        user.tasks.splice(taskIndex, 1);
        await updateUserToRemoteServer(user);
      }
    }
  }
}

async function updateUserToRemoteServer(user) {
  let users = await loadUsersFromServer();
  const userIndex = users.findIndex((u) => u.email == user.email);
  if (userIndex > 0) {
    users[userIndex] = user;
    await setUsersOnRemoteServer(users);
  }
  return userIndex;
}

async function updateUserContactsToRemoteServer(email, contacts) {
  let user = await getUserFromServer(email);
  user.contacts = contacts;
  await updateUserToRemoteServer(user);
}

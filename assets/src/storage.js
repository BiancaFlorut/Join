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

/**
 * Retrieves a user from the server based on the provided email.
 *
 * @param {string} email - The email of the user to retrieve.
 * @return {Promise<Object>} A Promise that resolves to the user object if found, or undefined if not found.
 */
async function getUserFromServer(email) {
  let users = await loadUsersFromServer();
  let user = users.find((u) => u.email == email);
  return user;
}

/**
 * Retrieves the task list of a user based on the provided email.
 *
 * @param {string} email - The email of the user to retrieve the task list for.
 * @return {Array} The list of tasks associated with the user.
 */
async function getTaskList(email) {
  let user = await getUserFromServer(email);
  return user.tasks;
}

/**
 * Retrieves the contact list of a user based on the provided email.
 *
 * @param {string} email - The email of the user to retrieve contacts for.
 * @return {Array} The list of contacts associated with the user.
 */
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

/**
 * Updates the tasks of a user based on the user's email.
 *
 * @param {string} userEmail - The email of the user.
 * @param {Array} tasks - The tasks to be updated.
 * @return {Promise<void>} A promise that resolves when the tasks have been updated.
 */
async function updateTasksFromUser(userEmail, tasks) {
  let user = await getUserFromServer(userEmail);
  let users = await loadUsersFromServer();
  let index = users.findIndex((u) => u.email == userEmail);
  user.tasks = tasks;
  users[index] = user;
  setUsersOnRemoteServer(users);
}

/**
 * Updates the user tasks based on the new task provided, 
 * by finding the corresponding user and task indexes, 
 * and either updating an existing task or adding a new task.
 *
 * @param {Object} newTask - The new task to update contacts about.
 * @return {Promise<void>} A promise that resolves when the contacts have been updated.
 */
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
      } else {
        user.tasks.push(newTask);
      }
      await updateUserToRemoteServer(user);
    }
  }
}

/**
 * Deletes a task from the tasks array of multiple users based on the provided contacts and task ID.
 *
 * @param {Array} contacts - An array of contact objects containing email addresses.
 * @param {string} id - The ID of the task to be deleted.
 * @return {Promise<void>} A promise that resolves when the task is deleted from the tasks array of all users.
 */
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

/**
 * Updates a user on the remote server with the provided user object.
 *
 * @param {Object} user - The user object to update on the remote server.
 * @return {number} The index of the updated user in the users array.
 */
async function updateUserToRemoteServer(user) {
  let users = await loadUsersFromServer();
  const userIndex = users.findIndex((u) => u.email == user.email);
  if (userIndex > 0) {
    users[userIndex] = user;
    await setUsersOnRemoteServer(users);
  }
  return userIndex;
}

/**
 * Updates the contacts of a user on the remote server.
 *
 * @param {string} email - The email of the user.
 * @param {Array} contacts - The updated contacts of the user.
 * @return {Promise<void>} A promise that resolves when the user's contacts have been updated on the remote server.
 */
async function updateUserContactsToRemoteServer(email, contacts) {
  let user = await getUserFromServer(email);
  user.contacts = contacts;
  await updateUserToRemoteServer(user);
}

let user;

/**
 * Initializes the function by including HTML, selecting the page, setting parameter queries, and initializing templates.
 *
 * @return {Promise<void>} This function does not return a value.
 */
async function init() {
    await includeHTML();
    selectedPage();
    setParameterQuery();
    templatesInit();
    user = await getUserFromServer(emailParameter);
}


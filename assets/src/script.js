let user;

async function init() {
    await includeHTML();
    selectedPage();
    setParameterQuery();
    templatesInit();
    user = await getUserFromServer(emailParameter);
}


async function loadContacts(){
    let item = await getItem('user');
    console.log(item);
}

let user = {
    email: 'Bertn@bla.com',
    name: 'Bert Loriot',
    password: '123',
    color: '#0038ff',
    contacts: [],
    tasks: [taskGuest1]
}




let taskStructure = {
    title: 'HTML Base Template Creation', // id addTitle // document.getElementById('addTitle').value
    description: 'Create reusable HTML base templates...',// id addDescription // document.getElementById('addDescription').value
    assign_to: [contactGuest, contactBenediktZiegler, contactKlarkKent, contactEmmanuelMauer], // id addAssignTo // existiert schon
    due_date: 1715292000000, // 10.05.2024 // id addDueDate muss in unix umgewandelt werden // document.getElementById('addDueDate').value  new Date.parse(2024-05-10) 
    creation_date: 1712663942047, // aktuelle Zeit // new Date()
    priority: 2, // 0 low, 1 medium, 2 urgent // existiert schon
    status: 'toDo',// fixe Einstellung
    category: '',// addCategory // existiert schon
    subtasks: [{text: 'Establish CSS Methodology', checked: true}, {text: 'Setup Base Styles', checked: true}], // existiert schon
    id: '1712663942047guest@guest.mail',// erstellungszeitraum hinzufügen?!? wie am anfang?? // 
}
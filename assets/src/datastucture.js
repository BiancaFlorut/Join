let userMaria = {
    email: 'mail@bla.com',
    name: 'Maria',
    password: '123',
    contacts: [],
    tasks: []
}

let contactMaria = {
    email: 'mail@bla.com',
    name: 'Maria',
    phone: 14674564,
    color: '#fc71ff'
}

let userAndrei = {
    email: 'Andrei@bla.com',
    name: 'Andrei Müller',
    password: '123',
    contacts: [],
    tasks: []
}

let contactAndrei = {
    email: 'Andrei@bla.com',
    name: 'Andrei Müller',
    phone: 1234674564,
    color: '#ffc701'
}

let userMarian = {
    email: 'Marian@bla.com',
    name: 'Marian Koch',
    password: '123',
    contacts: [],
    tasks: []
}

let contactMarian = {
    email: 'Marian@bla.com',
    name: 'Marian Koch',
    phone: 1234674564,
    color: '#0038ff'
}

let userBert = {
    email: 'Bertn@bla.com',
    name: 'Bert Loriot',
    password: '123',
    contacts: [],
    tasks: []
}

let contactBert = {
    email: 'Bertn@bla.com',
    name: 'Bert Loriot',
    phone: 1234674564,
    color: '#c3ff2b'
}

let task = {
    title: 'Log In erstellen',
    description: 'Design und Funktionalität erstellen',
    assign_to: [contactBert, contactMaria],
    due_date: 1712972885643,
    creation_date: 1712656863726,
    priority: 1, // 0 low, 1 medium, 2 urgent
    status: 'awaitFeedback',
    category: 'Technical Task',
    subtasks: [{text: 'Sign in form', checked: true}, {text: 'custom validation', checked: true}],
    id: '1712663942047andu@mail.com1712972885643',
}


let task2 = {
    title: 'Board Seite',
    description: 'Daten Übertragung',
    assign_to: [contactAndrei, userMaria],
    due_date: 1712972885643,
    creation_date: 1712663942047,
    priority: 1, // 0 low, 1 medium, 2 urgent
    category: 'Technical Task',
    subtasks: [{text: 'tasks erstellen', checked: true}, {text: 'tasks löschen', checked: false}],
    id: '1712663942047andu@mail.com1712972885643',
}

let userAndu = {
    email: 'andu@mail.com',
    name: 'Andu',
    password: '123',
    contacts: [contactBert, contactMaria, contactAndrei],
    tasks: [task, task2]
}

let contactAndu = {
    name: 'Andu',
    email: 'andu@mail.com',
    phone: '12345',
    color: '#ffe62b'
}

// neue contacts
let contactMarcelBauer = {
    name: 'Marcel Bauer',
    email: 'maba@mail.er',
    phone: '0123789456',
    color: '#ff7a00'
}

let contactAntonMayer = {
    name: 'Anton Mayer',
    email: 'anma@mail.er',
    phone: '0123456789',
    color: '#ff5eb3'
}

let contactEmmanuelMauer = {
    name: 'Emmanuel Mauer',
    email: 'emma@mail.er',
    phone: '0123456789',
    color: '#6e52ff'
}

let contactBenediktZiegler = {
    name: 'Benedikt Ziegler',
    email: 'bezi@mail.er',
    phone: '02222222222',
    color: '#9327ff'
}

let contactDavidEisenberg = {
    name: 'David Eisenberg ',
    email: 'daei@mail.er',
    phone: '03333333333',
    color: '#00bee8'
}

let contactEvaFischer = {
    name: 'EvaFischer',
    email: 'evfi@mail.er',
    phone: '04444444444',
    color: '#1fd7c1'
}

let contactKlarkKent = {
    name: 'Klark Kent',
    email: 'klke@mail.er',
    phone: '05555555555',
    color: '#ff745e'
}

let contactDarkwingDuck = {
    name: 'Darkwing Duck',
    email: 'dadu@mail.er',
    phone: '06666666666',
    color: '#ffa35e'
}

let contactGuest = {
    name: 'Guest',
    email: 'guest@guest.mail',
    phone: '',
    color: '#ff4646'
}

let taskGuest1 = {
    title: 'Mama anrufen',
    description: 'Sinn des Lebens besprechen',
    assign_to: [contactBert, contactMaria],
    due_date: 1712972885643,
    creation_date: 1712656863726, 
    priority: 2, // 0 low, 1 medium, 2 urgent
    status: 'toDo',
    category: 'User Story',
    subtasks: [{text: 'nehme das Telefon', checked: false}, {text: 'wähle die Nummer', checked: false},],
    id: '1712656863726guest@guest.mail1712972885643',// erstellungszeitraum hinzufügen?!?
}

let taskGuest2 = {
    title: 'Kochwelt Page & Recipe Recommender',
    description: 'Build start page with recipe recommendation',
    assign_to: [contactBert, contactMaria, contactDarkwingDuck],
    due_date: 1712972885643,
    creation_date: 1712662899038, 
    priority: 1, // 0 low, 1 medium, 2 urgent
    status: 'awaitFeedback',
    category: 'User Story',
    subtasks: [{text: 'nehme das Telefon', checked: false}, {text: 'wähle die Nummer', checked: false}, {text: 'tasks löschen', checked: false}],
    id: '1712662899038guest@guest.mail1712972885643',// erstellungszeitraum hinzufügen?!?
}

let taskGuest3 = {
    title: 'CSS Architecture Planning',
    description: 'Define CSS naming conventions and structure.',
    assign_to: [contactBert, contactDarkwingDuck, contactKlarkKent, contactEmmanuelMauer],
    due_date: 1712972885643,
    creation_date: 1712664403850, 
    priority: 0, // 0 low, 1 medium, 2 urgent
    status: 'done',
    category: 'Technical Task',
    subtasks: [],
    id: '1712664403850guest@guest.mail1712972885643',// erstellungszeitraum hinzufügen?!? wie am anfang??
}

let taskGuest4 = {
    title: 'HTML Base Template Creation',
    description: 'Create reusable HTML base templates...',
    assign_to: [contactGuest, contactBenediktZiegler, contactKlarkKent, contactEmmanuelMauer],
    due_date: 1712972885643,
    creation_date: 1712663942047, 
    priority: 2, // 0 low, 1 medium, 2 urgent
    status: 'inProgress',
    category: 'Technical Task',
    subtasks: [{text: 'Establish CSS Methodology', checked: true}, {text: 'Setup Base Styles', checked: true}],
    id: '1712663942047guest@guest.mail1712972885643',// erstellungszeitraum hinzufügen?!? wie am anfang??
}

let userGuest = {
    email: 'guest@guest.mail',
    name: 'Guest',
    password: '',
    contacts: [contactAntonMayer, contactBenediktZiegler, contactDarkwingDuck, contactDavidEisenberg, contactEmmanuelMauer, contactEvaFischer, contactKlarkKent, contactMarcelBauer],
    tasks: [taskGuest1, taskGuest2, taskGuest3, taskGuest4], // Tasksnamen ändern?!?
}

users = [userAndrei, userAndu, userBert, userMaria, userMarian, userGuest];
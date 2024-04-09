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
    phone: 14674564
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
    phone: 1234674564
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
    phone: 1234674564
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
    phone: 1234674564
}

let task = {
    title: 'Log In erstellen',
    description: 'Design und Funktionalität erstellen',
    assign_to: [contactBert, contactMaria],
    due_date: 1712572885643,
    creation_date: 1712656863726,
    priority: 1, // 0 low, 1 medium, 2 urgent
    status: 'awaitFeedback',
    category: 'Technical Task',
    subtasks: [{text: 'Sign in form', checked: true}, {text: 'custom validation', checked: true}],
    id: 'andu@mail.com1712572885643',
}


let task2 = {
    title: 'Board Seite',
    description: 'Daten Übertragung',
    assign_to: [contactAndrei, userMaria],
    due_date: 1712572885643,
    priority: 1, // 0 low, 1 medium, 2 urgent
    category: 'Technical Task',
    subtasks: [{text: 'tasks erstellen', checked: true}, {text: 'tasks löschen', checked: false}],
    id: 'andu@mail.com1712572885643',
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
    phone: '12345'
}

users = [userAndrei, userAndu, userBert, userMaria, userMarian];

let userGuest = {
    email: 'guest@guest.mail',
    name: 'Guest',
    lastname: '',
    password: '',
    contacts: [],
    tasks: [], // Tasksnamen ändern?!?
}

let taskGuest1 = {
    title: 'Mama anrufen',
    description: 'Sinn des Lebens besprechen',
    assign_to: [contactBert, contactMaria],
    due_date: 1712572885643, // Brauchen wir so etwas oder reicht ein datum? z.B 22.06.2024
    creation_date: 1712656863726, 
    priority: 1, // 0 low, 1 medium, 2 urgent
    status: 'toDo',
    category: 'esoteric Task',
    subtasks: ['nehme das Telefon', 'wähle die Nummer'],
    id: '1712656863726guest@guest.mail1712572885643',// erstellungszeitraum hinzufügen?!?
}

let taskGuest2 = {
    title: '',
    description: 'Sinn des Lebens besprechen',
    assign_to: [contactBert, contactMaria],
    due_date: 1712572885643, // Brauchen wir so etwas oder reicht ein datum? z.B 22.06.2024
    creation_date: 1712656863726, 
    priority: 1, // 0 low, 1 medium, 2 urgent
    status: 'toDo',
    category: 'esoteric Task',
    subtasks: ['nehme das Telefon', 'wähle die Nummer'],
    id: '1712656863726guest@guest.mail1712572885643',// erstellungszeitraum hinzufügen?!?
}
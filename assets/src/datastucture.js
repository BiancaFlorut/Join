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
    priority: 1, // 0 low, 1 medium, 2 urgent
    category: 'Technical Task',
    subtask: 'Sign in form',
    id: 'andu@mail.com1712572885643',
}


let task2 = {
    title: 'Board Seite',
    description: 'Daten Übertragung',
    assign_to: [contactAndrei, userMaria],
    due_date: 1712572885643,
    priority: 1, // 0 low, 1 medium, 2 urgent
    category: 'Technical Task',
    subtask: ['tasks erstellen', ['tasks löschen']],
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
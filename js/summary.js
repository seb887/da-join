const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';
const TASKS_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/tasks';

const monthString = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

function initSummary() {
    setSummaries();
    greeting();
    setActiveUserInitials();
}

function greeting() {
    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;
    if (hrs < 12) {
        greet = 'Good Morning,';
    } else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good afternoon,';
    } else if (hrs > 17 && hrs <= 24) {
        greet = 'Good Evening,';
    }
    document.getElementById('time-of-the-day').innerHTML = greet;
}

async function getTasks() {
    let response = await fetch(TASKS_URL + '.json');
    let allTasks = await response.json();
    return allTasks;
}


async function setToDoANumber() { 
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let toDoAmount = [0];
    allTasksAsObject.forEach((entry) =>{
        if (entry[1]['board'] == 'todo'){
            toDoAmount++;
        }
    })
    document.getElementById('to-do-tasks').innerText = toDoAmount;
}


async function setDoneNumber() { 
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let doneAmount = [0];
    allTasksAsObject.forEach((entry) =>{
        if (entry[1]['board'] == 'done'){
            doneAmount++;
        }
    })
    document.getElementById('done-tasks').innerText = doneAmount;
}


async function setUrgentNumber() { 
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let urgentAmount = [0];
    allTasksAsObject.forEach((entry) =>{
        if (entry[1]['prio'] == 'urgent'){
            urgentAmount++;
        }
    })
    document.getElementById('urgent-tasks').innerText = urgentAmount;
}


async function setTasksinBoardNumber() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let tasksInBoard = [0];
    allTasksAsObject.forEach((entry) =>{
        tasksInBoard++;
    })
    document.getElementById('tasks-in-board').innerText = tasksInBoard;
}


async function setTasksInProgressNumber() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let tasksInProgress = [0];
    allTasksAsObject.forEach((task) => {
        if (task[1]['board'] == 'in progress'){
            tasksInProgress++;
        }
    })
    document.getElementById('tasks-in-progress').innerText = tasksInProgress;
}


async function setAwaitingFeedbackNumber() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let awaitingFeedback = [0];
    allTasksAsObject.forEach((task) => {
        if (task[1]['board'] == 'await feedback'){
            awaitingFeedback++;
        }
    })
    document.getElementById('awaiting-feedback').innerText = awaitingFeedback;
}


async function setDeadlineDate() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let deadlines = [];
    allTasksAsObject.forEach((task) =>{
        let date = new Date(task[1]['date']).getTime()
        deadlines.push(date);
    })
    let upcomingDeadline = Math.min(...deadlines);
    let day = new Date(upcomingDeadline).getDate();
    let month = new Date(upcomingDeadline).getMonth();
    let year = new Date (upcomingDeadline).getFullYear();
    let date = day + ' ' + monthString[month] + ', ' + year
    document.getElementById('deadline').innerText = date;
}


function setSummaries(){
    setToDoANumber();
    setDoneNumber();
    setUrgentNumber();
    setTasksinBoardNumber();
    setTasksInProgressNumber();
    setAwaitingFeedbackNumber();
    setDeadlineDate();
}

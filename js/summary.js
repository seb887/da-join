const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';
const TASKS_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/tasks';


function initSummary() {
    greeting();
    setActiveUserInitials();
<<<<<<< HEAD
    setSummaries()
}

async function getActiveUser() {
    let response = await fetch(BASE_URL + '/activeUser.json');
    let activeUser = await response.json();
    if (activeUser) {
        document.getElementById('name').innerHTML = activeUser.activeName;
        return activeUser;
    }
}

async function deleteActiveUser() {
    response =  await fetch(BASE_URL + '/activeUser.json', {
        method: "DELETE",
    });
    window.location.href= "login.html";
=======
    document.getElementById('name').innerHTML = activeUser.name;
>>>>>>> f3aab704a5175e02fae692abe38d5ab6dec24b3b
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
<<<<<<< HEAD

function createLogOutDiv() {

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


function setSummaries(){
    setToDoANumber();
    setDoneNumber();
    setUrgentNumber();
    setTasksinBoardNumber();
    setTasksInProgressNumber();
    setAwaitingFeedbackNumber();
}
=======
>>>>>>> f3aab704a5175e02fae692abe38d5ab6dec24b3b

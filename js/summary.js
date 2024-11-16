const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';
const TASKS_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/tasks';

const monthString = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

/**
 * This function is active when the body loads. It sets up the summary
 */
function initSummary() {
    setSummaries();
    greeting();
    setActiveUserInitials();
    checkFirstLogin();
}

/**
 * Displays a greeting message based on the current time of day
 */
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

/**
 * Fetches the list of tasks from the specified URL
 * The function retrieves data in JSON format and returns it as a JavaScript object
 */
async function getTasks() {
    let response = await fetch(TASKS_URL + '.json');
    let allTasks = await response.json();
    return allTasks;
}

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the "todo" board
 * Updates the text content of the HTML element with the ID `to-do-tasks` to reflect the number of tasks
 */
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

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the "done" board
 * Updates the text content of the HTML element with the ID `done-tasks` to reflect the number of tasks
 */
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

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the "urgent" board
 * Updates the text content of the HTML element with the ID `urgent-tasks` to reflect the number of tasks
 */
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

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the board
 * Updates the text content of the HTML element with the ID `tasks-in-board` to reflect the number of tasks
 */
async function setTasksinBoardNumber() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let tasksInBoard = [0];
    allTasksAsObject.forEach((entry) =>{
        tasksInBoard++;
    })
    document.getElementById('tasks-in-board').innerText = tasksInBoard;
}

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the "in progress" board
 * Updates the text content of the HTML element with the ID `tasks-in-progress` to reflect the number of tasks
 */
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

/**
 * Retrieves the list of tasks and counts the number of tasks that are in the "awaiting feedback" board
 * Updates the text content of the HTML element with the ID `awaiting-feedback` to reflect the number of tasks
 */
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

/**
* Retrieves tasks and calculates the upcoming deadline date from the tasks
* Updates the text content of the HTML element with the ID `deadline`
*/
async function setDeadlineDate() {
    let tasks = await getTasks();
    const allTasksAsObject = Object.entries(await tasks);
    let deadlines = [];
    allTasksAsObject.forEach((task) =>{
        let date = new Date(task[1]['date']).getTime()
        deadlines.push(date);
    });
    let upcomingDeadline = Math.min(...deadlines);
    let day = new Date(upcomingDeadline).getDate();
    let month = new Date(upcomingDeadline).getMonth();
    let year = new Date (upcomingDeadline).getFullYear();
    let date = day + ' ' + monthString[month] + ', ' + year
    document.getElementById('deadline').innerText = date;
}

/**
 * Updates the summary information by calling various functions to set 
 * the counts of tasks in different categories and the upcoming deadline date
 * This function does not return any value but updates the UI with relevant data
 */
function setSummaries(){
    setToDoANumber();
    setDoneNumber();
    setUrgentNumber();
    setTasksinBoardNumber();
    setTasksInProgressNumber();
    setAwaitingFeedbackNumber();
    setDeadlineDate();
}
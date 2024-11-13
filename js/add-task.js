// DOM ELEMENTS
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputDate = document.getElementById('input-date');
const selectCategory = document.getElementById('select-category');
const subtasksList = document.getElementById('subtasks-list');
const addSubtasksImg = document.getElementById('add-subtask-img');
const submitSubtasksImg = document.getElementById('submit-subtask-img');
const cancelSubtasksImg = document.getElementById('cancel-subtask-img');

const inputSubtask = document.getElementById('input-subtask');
const buttonLow = document.getElementById('button-low');
const buttonMedium = document.getElementById('button-medium');
const buttonUrgent = document.getElementById('button-urgent');
const buttonLowImg = document.getElementById('button-low-img');
const buttonMediumImg = document.getElementById('button-medium-img');
const buttonUrgentImg = document.getElementById('button-urgent-img');
const assignedContactList = document.getElementById('assigned-contacts-list');
let inputAssignedTo = document.getElementById('input-assigned-to');
const searchContact = document.getElementById('searchContact');

let error = document.getElementById('add-task-error');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';
CONTACT_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json';
let subtasks = [];
let editSubtasks = [];
let assignedContacts = [];
let renderedContacts = [];
let dropedDown = false;
let matches = [];
let isSubtaskEditOn = false;

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;
let currentPrio = 'medium';

// FUNCTIONS

/**
 * Renders everything that has to be rendered on the site
 */
async function renderAddTask() {
  clearInputs();
  listContactsToAssignedTo();
  setActiveUserInitials();
}

/**
 * This is an asynchronous function that sends a new task to the database and at the end renders the board.
 *
 * @param {object} newTask - This is the object that should be saved to the database
 */
async function saveTaskToFirebase(newTask) {
  await fetch(BASE_URL + 'tasks' + '.json', {
    method: 'POST',
    body: JSON.stringify(newTask),
  });

  renderBoard();
}

/**
 *
 * This function creates a new task object with several properties and calls the checkInputs function with the new object.
 *
 */
function createNewTask() {
  let newTask = {
    title: inputTitle.value,
    description: inputDescription.value,
    date: inputDate.value,
    category: selectCategory.value,
    board: currentKanbanBoard,
    prio: currentPrio,
    subtasks: subtasks,
    assignedTo: matches,
  };

  checkInputs(newTask);
}

/**
 * This function checks the input fields for the title and category.
 * If one of the inputfields is empty a textmessage appears to insert a title or select a task.
 * If the required fields are filled the all inputfields are cleared and the object will be saved to the database.
 *
 * @param {object} taskObj - This is the object parameter for the saveTaskToFirebase call.
 */
function checkInputs(taskObj) {
  if (taskObj.title == '' || taskObj.category == 'Select task category') {
    if (taskObj.title == '') {
      error.innerHTML = 'Please insert a title';
    } else if (taskObj.category == 'Select task category') {
      error.innerHTML = 'Please select a category';
    }
  } else {
    document.body.style.pointerEvents = 'none';
    error.innerHTML = '';
    saveTaskToFirebase(taskObj);
    subtasksList.innerHTML = '';
    currentKanbanBoard = 'todo';
    clearInputs();
    showInfoToast('Task added to board');
    setTimeout(() => (window.location.href = 'board.html'), 1200);
  }
}

/**
 * This function clears the input fields, renders the subtask list, sets the prio button to the default value ('medium') and hides the subtask icons.
 */
function clearInputs() {
  inputTitle.value = '';
  inputDescription.value = '';
  selectCategory.value = 'Select task category';
  inputSubtask.value = '';
  subtasks = [];
  assignedContactList.innerHTML = '';
  searchContact ? (searchContact.value = '') : null;
  error.innerHTML = '';
  listContactsToAssignedTo();
  renderSubtasksList();
  setPrio('medium');
  hideSubtaskIcons();
}

// PRIO

/**
 * This function checks the prio string parameter if it is urgent, medium or low and calls the stylePrioButton function with the defined string and color
 *
 * @param {string} prio - This is the prio status transmitted as string
 */
function setPrio(prio) {
  switch (prio) {
    case 'urgent':
      currentPrio = 'urgent';
      checkIfEditIsOnPrio('urgent', '#ff3d00');
      break;
    case 'medium':
      currentPrio = 'medium';
      checkIfEditIsOnPrio('medium', '#FFA800');
      break;
    case 'low':
      currentPrio = 'low';
      checkIfEditIsOnPrio('low', '#7ae229');
      break;
  }
}

/**
 * This function check if edit is on and calls the stylePrioButton function and setNoPrio function
 *
 * @param {string} prio - This is the priority string
 * @param {string}} color - This is the defined background color for the prio button
 */
function checkIfEditIsOnPrio(prio, color) {
  if (isEditOn) {
    const button = document.getElementById(`edit-button-${prio}`);
    const buttonImg = document.getElementById(`edit-button-${prio}-img`);

    stylePrioButton(prio, color, button, buttonImg);
    setNoPrio(prio);
  } else {
    const button = document.getElementById(`button-${prio}`);
    const buttonImg = document.getElementById(`button-${prio}-img`);

    stylePrioButton(prio, color, button, buttonImg);
    setNoPrio(prio);
  }
}

/**
 * This function styles the selected button
 *
 * @param {string} prio - This is the priority string
 * @param {string}} color - This is the defined background color for the prio button
 * @param {string}} button - This is the prio button
 * @param {string}} buttonImg - This is the prio button img
 */
function stylePrioButton(prio, color, button, buttonImg) {
  button.style.background = color;
  button.style.color = 'white';
  button.style.fontWeight = 'bold';
  buttonImg.src = `../assets/icons/prio-${prio}-white.png`;
}

/**
 * This function restets the unselected prio button to default value
 *
 * @param {string} prio - This is actual prio status
 */
function setNoPrio(prio) {
  let noPrio = [];

  if (prio == 'urgent') {
    noPrio = ['medium', 'low'];
  } else if (prio == 'medium') {
    noPrio = ['urgent', 'low'];
  } else if (prio == 'low') {
    noPrio = ['urgent', 'medium'];
  }

  checkIfEditIsOnNoPrio(noPrio);
}

/**
 * Checks if editing is enabled and styles the corresponding buttons
 * for each element in the provided noPrio array
 *
 * @param {Array<string>} noPrio - An array of strings representing
 * the identifiers of elements that need to be styled
 */
function checkIfEditIsOnNoPrio(noPrio) {
  for (let element of noPrio) {
    if (isEditOn) {
      const noPrioButton = document.getElementById(`edit-button-${element}`);
      const noPrioButtonImg = document.getElementById(
        `edit-button-${element}-img`
      );

      styleNoPrioButtons(element, noPrioButton, noPrioButtonImg);
    } else {
      const noPrioButton = document.getElementById(`button-${element}`);
      const noPrioButtonImg = document.getElementById(`button-${element}-img`);

      styleNoPrioButtons(element, noPrioButton, noPrioButtonImg);
    }
  }
}

/**
 * Styles the no priority buttons and their associated images
 *
 * @param {string} noPrioElement - The identifier for the no priority element
 * @param {HTMLElement} noPrioButton - The button element to style
 * @param {HTMLElement} noPrioButtonImg - The image element to update the source
 */
function styleNoPrioButtons(noPrioElement, noPrioButton, noPrioButtonImg) {
  noPrioButton.style.background = 'white';
  noPrioButton.style.color = 'black';
  noPrioButton.style.fontWeight = 'normal';
  noPrioButtonImg.src = `../assets/icons/prio-${noPrioElement}.png`;
}

// INFO TOAST

/**
 * Displays an informational toast message with the provided text and hides it after a set duration
 *
 * @param {string} text - The text to display in the informational toast
 */
function showInfoToast(text) {
  const toast = document.getElementById('info-toast');
  const infoText = document.getElementById('infoText');
  infoText.innerText = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}

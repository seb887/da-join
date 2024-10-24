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
const inputAssignedTo = document.getElementById('input-assigned-to');

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

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;
// boardInputDate.valueAsDate = currentDate;

let currentPrio = 'medium';

// FUNCTIONS
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
  let error = document.getElementById('add-task-error');
  if (taskObj.title == '' || taskObj.category == 'Select task category') {
    if (taskObj.title == '') {
      error.innerHTML = 'Please insert a title';
    } else if (taskObj.category == 'Select task category') {
      error.innerHTML = 'Please select a category';
    }
  } else {
    error.innerHTML = '';
    saveTaskToFirebase(taskObj);
    subtasksList.innerHTML = '';
    currentKanbanBoard = 'todo';
    clearInputs();
    showInfoToast('Task added to board');
    setTimeout(() => closeAddTaskModal(), 1500);
  }
}

/**
 *
 *This function clears the input fields, renders the subtask list, sets the prio button to the default value ('medium') and hides the subtask icons.
 *
 */
function clearInputs() {
  inputTitle.value = '';
  inputDescription.value = '';
  selectCategory.value = 'Select task category';
  inputSubtask.value = '';
  subtasks = [];
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
    console.log('edit is on');
    const button = document.getElementById(`edit-button-${prio}`);
    const buttonImg = document.getElementById(`edit-button-${prio}-img`);

    stylePrioButton(prio, color, button, buttonImg);
    setNoPrio(prio);
  } else {
    console.log('edit is off');
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

function styleNoPrioButtons(noPrioElement, noPrioButton, noPrioButtonImg) {
  noPrioButton.style.background = 'white';
  noPrioButton.style.color = 'black';
  noPrioButton.style.fontWeight = 'normal';
  noPrioButtonImg.src = `../assets/icons/prio-${noPrioElement}.png`;
}

// SUBTASKS

function controlSubtaskIcons() {
  if (inputSubtask.value.length > 0) {
    // if (inputSubtask.value.length > 0) {
    showSubtaskIcons();
  } else {
    hideSubtaskIcons();
  }
}

function showSubtaskIcons() {
  addSubtasksImg.style.display = 'none';
  submitSubtasksImg.style.display = 'flex';
  cancelSubtasksImg.style.display = 'flex';
}

function hideSubtaskIcons() {
  addSubtasksImg.style.display = 'flex';
  submitSubtasksImg.style.display = 'none';
  cancelSubtasksImg.style.display = 'none';
}

function cancelInputSubtask() {
  inputSubtask.value = '';
  controlSubtaskIcons();
}

function submitInputSubtask() {
  const subtaskObj = {
    title: inputSubtask.value,
    checked: false,
  };

  subtasks.push(subtaskObj);
  inputSubtask.value = '';
  controlSubtaskIcons();
  renderSubtasksList();
}

function renderSubtasksList(taskId) {
  subtasksList.innerHTML = '';

  if (subtasks == undefined) {
    return;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      subtasksList.innerHTML += createSubtasksListHTML(i, taskId);
    }
  }
}

function createSubtasksListHTML(index, id) {
  return `
      <li id="subtask-${index}" class="subtasks">
        <div id="single-subtask-title-${index}" class="subtask-title">${subtasks[index].title}</div>
        <input id="input-edit-subtask-${index}" class="input-edit-subtask" type="text"/>
        <div class="subtask-buttons">
          <img
            src="../assets/icons/edit-subtask.png"
            alt="edit icon"
            id="edit-subtask-${index}"
            class="edit-subtask"
            onclick="editSingleSubtask('${id}', '${index}')"
          />
           <img
            src="../assets/icons/submit-subtask.png"
            alt="submit icon"
            id="submit-edit-subtask-${index}"
            class="submit-edit-subtask"
            onclick="submitEditedSingleSubtask('${id}', '${index}')"
          />
          <img
            src="../assets/icons/delete-subtask.png"
            alt="trash icon"
            id="delete-subtask-${index}"
            class="delete-subtask"
            onclick="deleteSingleSubtask('${id}', '${index}')"
          />
        </div>
      </li>
    `;
}

// TODO: Noch einprogrammieren mit Input Feld
async function editSingleSubtask(taskId, index) {
  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);

  if (taskId == 'undefined') {
    singleSubtaskTitle.style.display = 'none';
    inputEditSubtask.style.display = 'flex';
    editSubtaskBtn.style.display = 'none';
    submitEditSubtaskBtn.style.display = 'flex';
    subtask.style.borderBottom = '1px solid #29abe2';

    inputEditSubtask.value = subtasks[index].title;
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        singleSubtaskTitle.style.display = 'none';
        inputEditSubtask.style.display = 'flex';
        editSubtaskBtn.style.display = 'none';
        submitEditSubtaskBtn.style.display = 'flex';
        subtask.style.borderBottom = '1px solid #29abe2';

        inputEditSubtask.value = element.data.subtasks[index].title;
        // await updateTaskInFirebase(element.id, element.data);
      }
    }
  }
}

async function submitEditedSingleSubtask(taskId, index) {
  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);

  if (taskId == 'undefined') {
    subtasks[index].title = inputEditSubtask.value;

    singleSubtaskTitle.style.display = 'flex';
    inputEditSubtask.style.display = 'none';
    editSubtaskBtn.style.display = 'flex';
    submitEditSubtaskBtn.style.display = 'none';
    subtask.style.borderBottom = 'none';

    renderSubtasksList();
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        singleSubtaskTitle.style.display = 'flex';
        inputEditSubtask.style.display = 'none';
        editSubtaskBtn.style.display = 'flex';
        submitEditSubtaskBtn.style.display = 'none';
        subtask.style.borderBottom = 'none';

        element.data.subtasks[index].title = inputEditSubtask.value;

        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList();
      }
    }
  }
}

async function deleteSingleSubtask(taskId, index) {
  if (taskId == 'undefined') {
    subtasks.splice(index, 1);
    renderSubtasksList();
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        element.data.subtasks.splice(index, 1);
        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList();
      }
    }
  }
}

// INFO TOAST

function showInfoToast(text) {
  const toast = document.getElementById('info-toast');
  const infoText = document.getElementById('infoText');
  infoText.innerText = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}

async function getContacts() {
  let response = await fetch(CONTACT_URL);
  let contacts = await response.json();
  return contacts;
}

async function listContactsToAssignedTo() {
  let allContacts = Object.values(await getContacts());
  let id = Object.keys(await getContacts());
  renderedContacts = [];
  allContacts.forEach((contact, index) => {
    contact.id = id[index];
  });
  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  inputAssignedTo.innerHTML = '';
  allContacts.forEach((contact, index) => {
    inputAssignedTo.innerHTML += assignedToContactsContent(contact);
    if (document.getElementById(contact['id'] + '-container')) {
      document.getElementById(
        contact['id'] + '-container'
      ).style.backgroundColor = contact['color'];
    }
    renderedContacts.push(contact);
  });
}

function inspectCheckboxes(path) {
  let allDivs = document.getElementById('input-assigned-to');
  assignedContacts = [];
  allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
    if (cb.checked) {
      assignedContacts.push(cb.value);
      cb.parentElement.parentElement.classList.add('selected');
      renderAssignedContacts(path);
    }
    if (!cb.checked) {
      cb.parentElement.parentElement.classList.remove('selected');
      renderAssignedContacts(path);
    }
  });
}

function dropDownContacts() {
  const modal = document.getElementById('task-modal-edit-card');
  event.stopPropagation();
  if (modal) {
    modal.addEventListener('click', (e) => {
      closeDropdownMenu(inputAssignedTo);
    });
  }
  if (inputAssignedTo.style.display == 'flex') {
    closeDropdownMenu(inputAssignedTo);
  } else {
    openDropdownMenu(inputAssignedTo);
  }
}

function filterContacts(event) {
  if (showOrHideContactsOnInput()) {
    displayMatchingContacts();
  }
}

function showOrHideContactsOnInput() {
  let allDivs = document.getElementById('input-assigned-to');
  const contactList = document.getElementById('input-assigned-to');
  if (document.getElementById('searchContact').value.length > 0) {
    contactList.style.display = 'flex';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-up.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = 'none';
    });
    return true;
  } else {
    document.getElementById('input-assigned-to').style.display = 'none';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-down.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = '';
    });
    return false;
  }
}

function displayMatchingContacts() {
  let input = document.getElementById('searchContact');
  renderedContacts.forEach((contact) => {
    if (
      contact.name.toLowerCase().slice(0, 2) ==
      input.value.toLowerCase().slice(0, 2)
    )
      document.getElementById(
        `${contact.id}cb`
      ).parentElement.parentElement.style.display = '';
  });
}

function renderAssignedContacts(path) {
  let container = document.getElementById(path);
  container.innerHTML = '';
  matches = [];
  matches = renderedContacts.filter((contact) =>
    assignedContacts.some((id) => id.slice(0, -2) === contact.id)
  );
  matches.forEach((match, index) => {
    container.innerHTML += assignedInitialContent(match, index);
  });
}

function renderContactArray() {
  inputAssignedTo.innerHTML = '';
  renderedContacts.forEach((contact, index) => {
    inputAssignedTo.innerHTML += assignedToContactsContentFilter(
      contact,
      contact['id']
    );
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
  });
}

window.onscroll = function (ev) {
  const scrollPosition = window.innerHeight + Math.round(window.scrollY);
  const totalHeight = document.documentElement.scrollHeight;
  if (scrollPosition >= totalHeight) {
    document.getElementById('footer').classList.add('footer-animation');
  } else {
    document.getElementById('footer').classList.remove('footer-animation');
  }
};

function assignedToContactsContent(contact, id, index) {
  return `
  <label for ="${contact['id']}cb">
      <div class ="add-task-contact-list">
        <div>
          <div id= "${contact['id']}-container" class= "initial-div">${contact['initials']}</div>
          <div>${contact['name']}</div>
        </div>
        <input onchange ="inspectCheckboxes('assigned-contacts-list')" value="${contact['id']}cb" id="${contact['id']}cb" type ="checkbox">
      </div>
  </label>
    `;
}

function assignedToContactsContentFilter(contact, id) {
  return `
  <label for ="${id}cb">
      <div class ="add-task-contact-list">
        <div>
          <div id= "${id}-container" class= "initial-div">${contact['initials']}</div>
          <div>${contact['name']}</div>
        </div>
        <input onchange ="inspectCheckboxes('assigned-contacts-list')" value="${id}" id="${id}cb" type ="checkbox">
      </div>
  </label>
    `;
}

function assignedInitialContent(match, index) {
  return `
  <div id="addContactList${index}" class ="assigned-contacts-initial-container">
      <div>
        <div style="background-color:${match['color']}" id= "${match['id']}-container" class= "initial-div">${match['initials']}</div>
      </div>
  </div>
`;
}

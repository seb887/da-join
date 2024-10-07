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
const subtasks = [];
let assignedContacts = [];
let renderedContacts = [];
let dropedDown = false;

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;
let currentPrio = 'medium';

// FUNCTIONS
async function renderAddTask() {
  clearInputs();
  listContactsToAssignedTo();
}

async function saveTaskToFirebase(newTask) {
  await fetch(BASE_URL + 'tasks' + '.json', {
    method: 'POST',
    body: JSON.stringify(newTask),
  });

  renderBoard();
}

function createNewTask() {
  let newTask = {
    title: inputTitle.value,
    description: inputDescription.value,
    date: inputDate.value,
    category: selectCategory.value,
    bgCategory: setCategoryBackgroundColor(selectCategory.value),
    board: 'todo',
    prio: currentPrio,
    subtasks: subtasks,
    assignedTo: inputAssignedTo.value,
  };

  checkInputs(newTask);
}

function setCategoryBackgroundColor(category) {
  if (category == 'User Story') {
    return '#0038FF';
  } else if (category == 'Technical Task') {
    return '#1FD7C1';
  }
}

function checkInputs(taskObj) {
  if (taskObj.title == '' || taskObj.category == 'Select task category') {
    if (taskObj.title == '') {
      // return;
      alert('Please insert a title');
    } else if (taskObj.category == 'Select task category') {
      // return;
      alert('Please select a category');
    }
  } else {
    console.log('create new task: ', taskObj);
    saveTaskToFirebase(taskObj);
    subtasksList.innerHTML = '';
    closeAddTaskModal();
    showInfoToast('Task added to board');
  }
}

function clearInputs() {
  inputTitle.value = '';
  inputDescription.value = '';
  selectCategory.value = 'Select task category';
  inputSubtask.value = '';
}

function setPrio(prio) {
  if (prio == 'urgent') {
    currentPrio = 'urgent';
    controlPrioButtonStyle();
  } else if (prio == 'medium') {
    currentPrio = 'medium';
    controlPrioButtonStyle();
  } else if (prio == 'low') {
    currentPrio = 'low';
    controlPrioButtonStyle();
  }
}

function controlPrioButtonStyle() {
  if (currentPrio == 'urgent') {
    buttonUrgent.style.background = '#ff3d00';
    buttonUrgent.style.color = 'white';
    buttonUrgentImg.src = '../assets/icons/prio-urgent-white.png';
  } else {
    buttonUrgent.style.background = 'white';
    buttonUrgent.style.color = 'black';
    buttonUrgentImg.src = '../assets/icons/prio-urgent.png';
  }

  if (currentPrio == 'medium') {
    buttonMedium.style.background = '#FFA800';
    buttonMedium.style.color = 'white';
    buttonMediumImg.src = '../assets/icons/prio-medium-white.png';
  } else {
    buttonMedium.style.background = 'white';
    buttonMedium.style.color = 'black';
    buttonMediumImg.src = '../assets/icons/prio-medium.png';
  }

  if (currentPrio == 'low') {
    buttonLow.style.background = '#7ae229';
    buttonLow.style.color = 'white';
    buttonLowImg.src = '../assets/icons/prio-low-white.png';
  } else {
    buttonLow.style.background = 'white';
    buttonLow.style.color = 'black';
    buttonLowImg.src = '../assets/icons/prio-low.png';
  }
}

function controlSubtaskIcons() {
  if (inputSubtask.value.length > 0) {
    addSubtasksImg.style.display = 'none';
    submitSubtasksImg.style.display = 'flex';
    cancelSubtasksImg.style.display = 'flex';
  } else {
    addSubtasksImg.style.display = 'flex';
    submitSubtasksImg.style.display = 'none';
    cancelSubtasksImg.style.display = 'none';
  }
}

function cancelInputSubtask() {
  inputSubtask.value = '';
  controlSubtaskIcons();
}

function submitInputSubtask() {
  subtasks.push(inputSubtask.value);
  inputSubtask.value = '';
  controlSubtaskIcons();
  renderSubtasks();

  console.log(subtasks);
}

function renderSubtasks() {
  subtasksList.innerHTML = '';

  for (let element of subtasks) {
    subtasksList.innerHTML += `<li class="subtask">${element}</li>`;
  }
}

// TOAST INFO
function showInfoToast(text) {
  const toast = document.getElementById('info-toast');
  const infoText = document.getElementById('infoText');
  infoText.innerText = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}

// eventually import function from contact.js
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
    inputAssignedTo.innerHTML += assignedToContactsContent(contact, id, index);
    document.getElementById(id[index] + '-container').style.backgroundColor =
      contact['color'];
    renderedContacts.push(contact);
  });
}

function inspectCheckboxes() {
  let allDivs = document.getElementById('input-assigned-to');
  assignedContacts = [];
  allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
    if (cb.checked) {
      assignedContacts.push(cb.value);
      cb.parentElement.parentElement.classList.add('selected');
    }
    if (!cb.checked) {
      cb.parentElement.parentElement.classList.remove('selected');
    }
  });
}

function dropDownContacts() {
  const contactList = document.getElementById('input-assigned-to');
  if (contactList.style.display == 'flex') {
    contactList.style.display = 'none';
    document.getElementById('searchContact').placeholder =
      'Select contacts to assign';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-down.png';
  } else {
    contactList.style.display = 'flex';
    document.getElementById('searchContact').placeholder = '';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-up.png';
  }
  dropedDown = !dropedDown;
}

function filterContacts(event) {
  console.log(dropedDown);

  if (
    document.getElementById('searchContact').value.length >= 3 &&
    !dropedDown
  ) {
    dropDownContacts();
    displayMatchingContacts();
  } else {
    document.getElementById('input-assigned-to').style.display = 'none';
    dropedDown = false;
    return;
  }
  displayMatchingContacts();
}

function displayMatchingContacts() {
  console.log('hallo');
}

function assignedToContactsContent(contact, id, index) {
  return `
  <label for ="${id[index]}cb">
      <div class ="add-task-contact-list">
        <div>
          <div id= "${id[index]}-container" class= "initial-div">${contact['initials']}</div>
          <div>${contact['name']}</div>
        </div>
        <input onchange ="inspectCheckboxes()" value="${id[index]}" id="${id[index]}cb" type ="checkbox">
      </div>
  </label>
    `;
}

renderAddTask();

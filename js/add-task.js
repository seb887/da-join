// DOM ELEMENTS
let inputTitle = document.getElementById('input-title');
let inputDescription = document.getElementById('input-description');
let inputDate = document.getElementById('input-date');
let selectCategory = document.getElementById('select-category');
let subtasksList = document.getElementById('subtasks-list');
let addSubtasksImg = document.getElementById('add-subtask-img');
let submitSubtasksImg = document.getElementById('submit-subtask-img');
let cancelSubtasksImg = document.getElementById('cancel-subtask-img');
let inputSubtask = document.getElementById('input-subtask');
let buttonLow = document.getElementById('button-low');
let buttonMedium = document.getElementById('button-medium');
let buttonUrgent = document.getElementById('button-urgent');
let buttonLowImg = document.getElementById('button-low-img');
let buttonMediumImg = document.getElementById('button-medium-img');
let buttonUrgentImg = document.getElementById('button-urgent-img');
let inputAssignedTo = document.getElementById('input-assigned-to');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';
CONTACT_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json';
let subtasks = [];
let assignedContacts = [];
let renderedContacts = [];
let dropedDown = false;
let matches = [];

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;
let currentPrio = 'medium';

// FUNCTIONS
async function renderAddTask() {
  clearInputs();
  listContactsToAssignedTo();
  setActiveUserInitials();
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
    board: currentKanbanBoard,
    prio: currentPrio,
    subtasks: subtasks,
    assignedTo: matches,
  };

  console.log(newTask);
  checkInputs(newTask);
}

function checkInputs(taskObj) {
  if (taskObj.title == '' || taskObj.category == 'Select task category') {
    if (taskObj.title == '') {
      alert('Please insert a title');
    } else if (taskObj.category == 'Select task category') {
      alert('Please select a category');
    }
  } else {
    saveTaskToFirebase(taskObj);
    subtasksList.innerHTML = '';
    currentKanbanBoard = 'todo';
    clearInputs();
    showInfoToast('Task added to board');
  }
}

function clearInputs() {
  inputTitle.value = '';
  inputDescription.value = '';
  selectCategory.value = 'Select task category';
  inputSubtask.value = '';
}

// PRIO

function setPrio(prio) {
  if (prio == 'urgent') {
    currentPrio = 'urgent';
    console.log(currentPrio);
    controlPrioButtonStyle();
  } else if (prio == 'medium') {
    currentPrio = 'medium';
    console.log(currentPrio);
    controlPrioButtonStyle();
  } else if (prio == 'low') {
    currentPrio = 'low';
    console.log(currentPrio);
    controlPrioButtonStyle();
  }
}

function controlPrioButtonStyle() {
  if (currentPrio == 'urgent') {
    buttonUrgent.style.background = '#ff3d00';
    buttonUrgent.style.color = 'white';
    buttonUrgent.style.fontWeight = 'bold';
    buttonUrgentImg.src = '../assets/icons/prio-urgent-white.png';
  } else {
    buttonUrgent.style.background = 'white';
    buttonUrgent.style.color = 'black';
    buttonUrgent.style.fontWeight = 'normal';
    buttonUrgentImg.src = '../assets/icons/prio-urgent.png';
  }

  if (currentPrio == 'medium') {
    buttonMedium.style.background = '#FFA800';
    buttonMedium.style.color = 'white';
    buttonMedium.style.fontWeight = 'bold';
    buttonMediumImg.src = '../assets/icons/prio-medium-white.png';
  } else {
    buttonMedium.style.background = 'white';
    buttonMedium.style.color = 'black';
    buttonMedium.style.fontWeight = 'normal';
    buttonMediumImg.src = '../assets/icons/prio-medium.png';
  }

  if (currentPrio == 'low') {
    buttonLow.style.background = '#7ae229';
    buttonLow.style.color = 'white';
    buttonLow.style.fontWeight = 'bold';
    buttonLowImg.src = '../assets/icons/prio-low-white.png';
  } else {
    buttonLow.style.background = 'white';
    buttonLow.style.color = 'black';
    buttonLow.style.fontWeight = 'normal';
    buttonLowImg.src = '../assets/icons/prio-low.png';
  }
}

// SUBTASKS

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
  const subtaskObj = {
    title: inputSubtask.value || editInputTitle,
    checked: false,
  };
  subtasks.push(subtaskObj);
  inputSubtask.value = '';
  editInputSubtask.value = '';
  controlSubtaskIcons();
  renderSubtasksList(subtasksList);
  renderSubtasksList(editSubtasksList);

  console.log(subtasks);
}

function renderSubtasksList(list, taskId) {
  list.innerHTML = '';

  if (subtasks == undefined) {
    return;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      list.innerHTML += `
      <li class="subtasks">
        <div class="subtask-title">${subtasks[i].title}</div>
        <div class="subtask-buttons">
          <img
            src="../assets/icons/edit.png"
            alt="edit icon"
            id="edit-subtask"
            onclick="editSubtask('${taskId}', '${i}')"
          />
          <img
            src="../assets/icons/delete.png"
            alt="trash icon"
            id="delete-subtask"
            onclick="deleteSubtask('${taskId}', '${i}')"
          />
        </div>

      </li>
    `;
    }
  }
}

// TODO: Noch einprogrammieren mit Input Feld
async function editSubtask(taskId, index) {
  if (taskId === undefined) {
    console.log('taskId is undefined');
  } else {
    console.log('taskId is defined', taskId);

    for (let element of tasks) {
      if (element.id == taskId) {
        // await updateTaskInFirebase(element.id, element.data);
      }
    }
  }
}

async function deleteSubtask(taskId, index) {
  if (taskId == 'undefined') {
    subtasks.splice(index, 1);
    renderSubtasksList(subtasksList);
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        element.data.subtasks.splice(index, 1);
        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList(subtasksList);
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

// window.onscroll = function (ev) {
//   const scrollPosition = window.innerHeight + Math.round(window.scrollY);
//   const totalHeight = document.documentElement.scrollHeight;
//   if (scrollPosition >= totalHeight) {
//     document.getElementById('footer').classList.add('footer-animation');
//   } else {
//     document.getElementById('footer').classList.remove('footer-animation');
//   }
// };

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

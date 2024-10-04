// DOM ELEMENTS
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputDate = document.getElementById('input-date');
const selectCategory = document.getElementById('select-category');
const subtasksList = document.getElementById('subtasks-list');
const inputSubtasks = document.getElementById('input-subtasks');
const buttonLow = document.getElementById('button-low');
const buttonMedium = document.getElementById('button-medium');
const buttonUrgent = document.getElementById('button-urgent');
const buttonLowImg = document.getElementById('button-low-img');
const buttonMediumImg = document.getElementById('button-medium-img');
const buttonUrgentImg = document.getElementById('button-urgent-img');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;
let currentPrio = 'medium';

// FUNCTIONS
async function saveTaskToFirebase(newTask) {
  await fetch(BASE_URL + 'tasks' + '.json', {
    method: 'POST',
    body: JSON.stringify(newTask),
  });

  render();
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
      alert('Please insert a title');
    } else if (taskObj.category == 'Select task category') {
      alert('Please select the category');
    }
  } else {
    console.log('create new task: ', taskObj);
    saveTaskToFirebase(taskObj);
    closeAddTaskModal();
    showInfoToast('Task added to board');
  }
}

function clearInputs() {
  inputTitle.value = '';
  inputDescription.value = '';
  selectCategory.value = 'Select task category';
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

// DOM ELEMENTS
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputDate = document.getElementById('input-date');
const selectCategory = document.getElementById('select-category');
const subtasksList = document.getElementById('subtasks-list');
const inputSubtasks = document.getElementById('input-subtasks');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';

// DEFAULTS
let currentDate = new Date();
inputDate.valueAsDate = currentDate;

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

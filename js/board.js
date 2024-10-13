// DOM ELEMENTS
const kanbanListTodo = document.getElementById('kanban-list-todo');
const kanbanListInProgress = document.getElementById('kanban-list-in-progress');
const kanbanListAwaitFeedback = document.getElementById(
  'kanban-list-await-feedback'
);
const kanbanListDone = document.getElementById('kanban-list-done');
const taskModal = document.getElementById('task-modal');
const taskModalCard = document.getElementById('task-modal-card');
const taskModalEditCard = document.getElementById('task-modal-edit-card');
const addTaskModal = document.getElementById('add-task-modal');
const searchInput = document.getElementById('search-input');
const taskModalSubtasks = document.getElementById('task-modal-card-subtasks');
const taskModalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);

// VARIABLES
const tasks = [];
const contacts = [];
let currentDraggedElementId = '';

// FUNCTIONS
async function renderBoard() {
  await loadTasksFromFirebase();
  await loadContactsFromFirebase();
  clearInputs();
  setActiveUserInitials();
  searchInput.value = '';
}

async function loadContactsFromFirebase() {
  let response = await fetch(BASE_URL + 'contacts' + '.json');
  let contactsFromFirebase = await response.json();

  if (contactsFromFirebase == null) {
    return;
  } else {
    contacts.length = 0;
    pushDataFromFirebaseToArr(contactsFromFirebase, contacts);
    // console.log('contacts:', contacts);
  }
}

async function loadTasksFromFirebase() {
  let response = await fetch(BASE_URL + 'tasks' + '.json');
  let tasksDataFromFirebase = await response.json();

  if (tasksDataFromFirebase == null) {
    return;
  } else {
    tasks.length = 0;
    pushDataFromFirebaseToArr(tasksDataFromFirebase, tasks);
  }
}

function pushDataFromFirebaseToArr(dataFromFirebase, arrToPush) {
  let objectKeys = Object.keys(dataFromFirebase);

  for (let i = 0; i < objectKeys.length; i++) {
    arrToPush.push({
      id: objectKeys[i],
      data: dataFromFirebase[objectKeys[i]],
    });
  }

  renderKanbanLists(tasks);
}

function renderKanbanLists(tasksArr) {
  clearKanbanLists();

  console.log(tasksArr);

  renderData(filterData('todo', tasksArr), kanbanListTodo);
  renderData(filterData('in progress', tasksArr), kanbanListInProgress);
  renderData(filterData('await feedback', tasksArr), kanbanListAwaitFeedback);
  renderData(filterData('done', tasksArr), kanbanListDone);
}

function filterData(board, tasksArr) {
  if (board == 'todo') {
    return tasksArr.filter((t) => t.data.board == 'todo');
  }
  if (board == 'in progress') {
    return tasksArr.filter((p) => p.data.board == 'in progress');
  }
  if (board == 'await feedback') {
    return tasksArr.filter((f) => f.data.board == 'await feedback');
  }
  if (board == 'done') {
    return tasksArr.filter((d) => d.data.board == 'done');
  }
}

function renderData(tasksArr, kanbanList) {
  if (tasksArr.length == 0) {
    kanbanList.innerHTML = `<div class="no-tasks-card">No tasks</div>`;
  } else {
    for (let i = 0; i < tasksArr.length; i++) {
      kanbanList.innerHTML += createCardHTML(tasksArr[i]);
      renderAssignedToInCard();
    }
  }
}

function clearKanbanLists() {
  kanbanListTodo.innerHTML = '';
  kanbanListInProgress.innerHTML = '';
  kanbanListAwaitFeedback.innerHTML = '';
  kanbanListDone.innerHTML = '';
}

function openTaskModal(event) {
  taskModal.style.display = 'flex';
  getDataForSingleTask(event);
}

function closeTaskModal() {
  taskModal.style.display = 'none';
  taskModalCard.style.display = 'flex';
  taskModalEditCard.style.display = 'none';
  renderBoard();
}

function closeTaskModalESC(event) {
  if (event.key === 'Escape') {
    closeTaskModal();
  }
}

function openAddTaskModal() {
  addTaskModal.style.display = 'flex';
  // addTaskModal.innerHTML = createAddTaskModalHTML();
}

function closeAddTaskModal() {
  addTaskModal.style.display = 'none';
}

// function checkTaskModalSubtasks(task) {
//   if (task.data.subtasks && task.data.subtasks.length > 0) {
//     return `
//     <div class="task-modal-card-subtasks" id="task-modal-card-subtasks">
//       Subtasks:
//       <div class="task-modal-card-subtasks-list" id="task-modal-card-subtasks-list" >
//         ${renderSubtasksModal(task)}
//       </div>
//   </div>`;
//   } else {
//     return '';
//   }
// }

function renderSubtaskProgressBar(task) {
  if (task.data.subtasks && task.data.subtasks.length > 0) {
    return `
      <div class="subtask-progress-bar-container">
        <div class="subtask-progress-bar">
            <div class="subtask-progress-bar-done" style="width: ${calcSubtaskProgressBar(
              task
            )}px"></div>
        </div>
        ${calcSubtaskCounter(task)}
      </div>
    `;
  } else {
    return '';
  }
}

function calcSubtaskCounter(task) {
  let subtaskChecked = 0;
  let subtasksAll = task.data.subtasks.length;

  for (const element of task.data.subtasks) {
    if (element.checked) {
      subtaskChecked++;
    }
  }

  return `<div class="subtask-counter">${subtaskChecked}/${subtasksAll} Subtasks</div>`;
}

function calcSubtaskProgressBar(task) {
  let progressBarFull = 128;
  let progressBarDone = 0;
  let subtaskChecked = 0;
  let subtasksAll = task.data.subtasks.length;

  for (const element of task.data.subtasks) {
    if (element.checked) {
      subtaskChecked++;
    }
  }
  progressBarDone = (progressBarFull / subtasksAll) * subtaskChecked;

  return progressBarDone;
}

// DRAG AND DROP
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  currentDraggedElementId = event.target.id;
}

async function drop(board) {
  for (let element of tasks) {
    if (currentDraggedElementId == element.id) {
      element.data.board = board;
      await updateTaskInFirebase(element.id, element.data);
    }
  }

  renderBoard();
}

async function updateTaskInFirebase(taskId, updatedTask) {
  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
  });
}

function highlight(id) {
  document.getElementById(id).classList.add('highlight-kanban-list');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('highlight-kanban-list');
}

// SEARCH TASKS
function searchTask() {
  clearKanbanLists(); // Leert den Content Bereich
  controlVisibilityInputClearBtn();

  let inputText = searchInput.value.toLowerCase();

  const filteredData = tasks.filter(
    (element) =>
      element.data.title.toLowerCase().includes(inputText) ||
      element.data.description.toLowerCase().includes(inputText)
  ); // Filtert das Arr nach der Eingabe im Input

  renderKanbanLists(filteredData);
}

function controlVisibilityInputClearBtn() {
  if (searchInput.value.length > 0) {
    clearInputBtn.style.visibility = 'visible';
  } else {
    clearInputBtn.style.visibility = 'hidden';
  }
}

function cancelSearchTask() {
  searchInput.value = '';

  renderKanbanLists(tasks);
  controlVisibilityInputClearBtn();
}

//showInfoToast('Tast added to board') should be moved to the addTask function after creation
function showInfoToast(text) {
  event.preventDefault();
  const toast = document.getElementById('info-toast');
  const infoText = document.getElementById('infoText');
  infoText.innerText = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}

async function returnTasksFromFirebase() {
  let response = await fetch(BASE_URL + 'tasks' + '.json');
  let tasks = await response.json();
  let taskAsObject = Object.values(tasks);
  let taskKeys = Object.keys(tasks);
  taskAsObject.forEach((task, index) => {
    task.id = taskKeys[index];
  });
  return taskAsObject;
}

async function renderAssignedToInCard() {
  let tasks = await returnTasksFromFirebase();
  let assignedTo = await getAllAssignedTo();
  let card = document.getElementById('card-footer');
  tasks.forEach((tasks, index) => {
    card.innerHTML = '';
    assignedTo[0].forEach((assignedContact, index) => {
      card.innerHTML += `
      <div id="${assignedContact.id + '-cpb'}" class="card-profile-badge-3">${assignedContact.initials}</div>
    `;
    document.getElementById(`${assignedContact.id + '-cpb'}`).style.backgroundColor = assignedContact.color;
    });
  });
}

async function getAllAssignedTo() {
  let tasks = await returnTasksFromFirebase();
  let assignTo = [];
  tasks.forEach((task) => {
    if (task['assignedTo']) {
      assignTo.push(task['assignedTo']);
    }
  });
  return assignTo;
}

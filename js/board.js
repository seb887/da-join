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
const clearInputBtn = document.getElementById('search-clear-btn');
let sContactAdd = document.getElementById('searchContact');
let sContactBoard = document.getElementById('searchContact-board');
let sContactBoardAddTask = document.getElementById(
  'searchContact-board-addTask'
);
const taskModalSubtasks = document.getElementById('task-modal-card-subtasks');
const taskModalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);
const contactContainer = document.getElementById('assigned-contacts-list');
const inputATAT = document.getElementById('input-assigned-to-addTask');
const input1 = document.getElementById('searchContact-board');
const input2 = document.getElementById('searchContact-board-addTask');

// VARIABLES
const tasks = [];
const contacts = [];
let currentDraggedElementId = '';
let currentKanbanBoard = 'todo';
let animationActiveBoard = false;
let modalActive = false;

// FUNCTIONS
async function renderBoard() {
  await loadTasksFromFirebase();
  await loadContactsFromFirebase();
  await listContactsToAssignedTo();
  clearInputs();
  setActiveUserInitials();
  await updateComparedTasks();
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

function renderData(tasksArr, kanbanList, path = '') {
  if (tasksArr.length == 0) {
    kanbanList.innerHTML = `<div class="no-tasks-card">No tasks</div>`;
  } else {
    for (let i = 0; i < tasksArr.length; i++) {
      kanbanList.innerHTML += createCardHTML(tasksArr[i]);
      renderAssignedToInCard(tasksArr[i].id, tasksArr[i], 'card-footer');
    }
  }
}

function clearKanbanLists() {
  kanbanListTodo.innerHTML = '';
  kanbanListInProgress.innerHTML = '';
  kanbanListAwaitFeedback.innerHTML = '';
  kanbanListDone.innerHTML = '';
}

function openTaskModal(id) {
  taskModal.style.display = 'flex';
  taskModalCard.style.display = 'flex';
  modalSlideInOrOut('task-modal-card');
  getDataForSingleTask(id);
  displayTaskModalContacts(id);
}

function closeTaskModal() {
  taskModalCard.style.display = 'flex';

  setTimeout(() => {
    taskModal.style.display = 'none';
    taskModalEditCard.style.display = 'none';
  }, 250);

  if (document.getElementById('task-modal-edit-card').style.display == 'flex') {
    taskModalCard.style.display = 'none';
    modalSlideInOrOut('task-modal-edit-card');
  } else {
    modalSlideInOrOut('task-modal-card');
  }
  isEditOn = false;
  removeAssignedList();
  clearAssignedContacts();
  renderBoard();
}

function openAddTaskModal(kanbanBoard) {
  if (window.innerWidth < 890) {
    window.location.href = 'add-task.html';
    return;
  }
  addTaskModal.style.display = 'flex';
  renderAllContactsInAddTask();
  currentKanbanBoard = kanbanBoard;
  modalSlideInOrOut('add-task-modal-card');
}

function closeAddTaskModal() {
  modalSlideInOrOut('add-task-modal-card');
  setTimeout(() => {
    addTaskModal.style.display = 'none';
  }, 250);
  clearAssignedContacts();
  clearInputs();
}

function cancelAddTask() {
  clearInputs();
  clearAssignedContacts();
  closeAddTaskModal();
}

function renderSubtaskProgressBar(task) {
  if (task.data.subtasks && task.data.subtasks.length > 0) {
    return `
      <div class="subtask-progress-bar-container">
        <div class="subtask-progress-bar">
            <div class="subtask-progress-bar-done" style="width: ${calcSubtaskProgressBar(
              task
            )}%"></div>
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
  let progressBarFull = 100;
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

function highlight(id) {
  document.getElementById(id).classList.add('highlight-kanban-list');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('highlight-kanban-list');
}

function searchTask() {
  clearKanbanLists();
  controlVisibilityInputClearBtn();

  let inputText = searchInput.value.toLowerCase();

  const filteredData = tasks.filter(
    (element) =>
      element.data.title.toLowerCase().includes(inputText) ||
      element.data.description.toLowerCase().includes(inputText)
  );

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

//showInfoToast('Task added to board') should be moved to the addTask function after creation
function showInfoToast(text) {
  // event.preventDefault();
  const toast = document.getElementById('info-toast');
  // const infoText = document.getElementById('infoText');
  toast.innerText = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}

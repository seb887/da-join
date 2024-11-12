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

/**
 * Calls all necessary functions to display the board properly
 *
 */
async function renderBoard() {
  await loadTasksFromFirebase();
  await loadContactsFromFirebase();
  await listContactsToAssignedTo();
  clearInputs();
  setActiveUserInitials();
  await updateComparedTasks();
  searchInput.value = '';
}

/**
 * Creates an array of all contacts from the database
 *
 * @returns
 */
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

/**
 * Creates an array of all tasks from the database
 *
 * @returns
 */

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

/**
 * Creates an object of the data from firebase and pushes them to an array
 *
 * @param {*} dataFromFirebase
 * @param {*} arrToPush
 */
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

/**
 * Clears all kanbanlists and creates the inner HTML content for all states on the board
 *
 * @param {array} tasksArr - Array with single task
 */

function renderKanbanLists(tasksArr) {
  clearKanbanLists();
  renderData(filterData('todo', tasksArr), kanbanListTodo);
  renderData(filterData('in progress', tasksArr), kanbanListInProgress);
  renderData(filterData('await feedback', tasksArr), kanbanListAwaitFeedback);
  renderData(filterData('done', tasksArr), kanbanListDone);
}

/**
 * Filters the associated tasks for the kanban list
 *
 * @param {string} board - String of the specific board status
 * @param {*} tasksArr - array of single task
 * @returns
 */
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

/**
 * Creates the HTML card element with the  for each task
 *
 * @param {array} tasksArr - Array
 * @param {object} kanbanList
 * @param {string} path
 */
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

/**
 * Clears the content in all kanban lists
 *
 */
function clearKanbanLists() {
  kanbanListTodo.innerHTML = '';
  kanbanListInProgress.innerHTML = '';
  kanbanListAwaitFeedback.innerHTML = '';
  kanbanListDone.innerHTML = '';
}

/**
 * Displays the task modal on click and  with the requested firebase content.
 *
 * @param {string} id - The identifier for the specific task
 */
function openTaskModal(id) {
  taskModal.style.display = 'flex';
  taskModalCard.style.display = 'flex';
  modalSlideInOrOut('task-modal-card');
  getDataForSingleTask(id);
  displayTaskModalContacts(id);
  closeDropdownOnclickBoard()
}

/**
 * Closes the task modal and renders the board content
 *
 */
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

/**
 * Opens the add task modal with the selected kanban list
 *
 * @param {object} kanbanBoard - Object of the kanban list
 * @returns
 */
function openAddTaskModal(kanbanBoard) {
  if (window.innerWidth < 890) {
    window.location.href = 'add-task.html';
    return;
  }
  addTaskModal.style.display = 'flex';
  renderAllContactsInAddTask();
  currentKanbanBoard = kanbanBoard;
  modalSlideInOrOut('add-task-modal-card');
  closeDropdownOnclickBoardAddTask()
}

/**
 * hides the add task modal with a slide out animation and clears all inputs and assigned contacts
 *
 */
function closeAddTaskModal() {
  modalSlideInOrOut('add-task-modal-card');
  setTimeout(() => {
    addTaskModal.style.display = 'none';
  }, 250);
  clearAssignedContacts();
  clearInputs();
}

/**
 * closes the add task modal and clears the input and assigned contacts
 *
 */
function cancelAddTask() {
  clearInputs();
  clearAssignedContacts();
  closeAddTaskModal();
}

/**
 * Creates a progressbar and displays the progrees of finished subtasks
 *
 * @param {object} task - Specific task object
 * @returns
 */
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

/**
 * This function checks the subtasks of a single task. If the subtask is checked the variable subtastkChecked is incremented by 1.
 *
 * @param {object} task - Specific task object
 * @returns
 */
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

/**
 * This function calculates the progress of the specific task between 0 to 100
 *
 * @param {object} task - task object
 * @returns
 */
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

/**
 * Prevents the default behavior of the element
 *
 * @param {object} event - Event Object
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Adds the the event target id to the variable currentDraggedElementId
 *
 * @param {*} event - Event Object
 */
function drag(event) {
  currentDraggedElementId = event.target.id;
}

/**
 * This function changes the path of the dropped element in the database and thereafter renders the board
 *
 * @param {*} board
 */
async function drop(board) {
  for (let element of tasks) {
    if (currentDraggedElementId == element.id) {
      element.data.board = board;
      await updateTaskInFirebase(element.id, element.data);
    }
  }
  await renderBoard();
}

/**
 * Highlights the border with a dotted line while dragging and hovering over the actual kanbanlist
 *
 * @param {*} id
 */
function highlight(id) {
  document.getElementById(id).classList.add('highlight-kanban-list');
}

/**
 * Removes the dotted line after leaving the kanban list container while dragging an element
 *
 * @param {*} id
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('highlight-kanban-list');
}

/**
 * This function filters the input text and renders the kanban list with the filtered data
 *
 */
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

/**
 * Switches the visibility of the clearInputBtn on input to visible and on an empty input field to invisible.
 *
 */
function controlVisibilityInputClearBtn() {
  if (searchInput.value.length > 0) {
    clearInputBtn.style.visibility = 'visible';
  } else {
    clearInputBtn.style.visibility = 'hidden';
  }
}

/**
 * Clears the search inputfield and renders the kanban list
 *
 */
function cancelSearchTask() {
  searchInput.value = '';
  renderKanbanLists(tasks);
  controlVisibilityInputClearBtn();
}

/**
 * Slides in an info toast with a defined text and slides out after 1.5 seconds
 *
 * @param {string} text - Displayed text in the info toast
 */
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

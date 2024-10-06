// DOM ELEMENTS
const kanbanListTodo = document.getElementById('kanban-list-todo');
const kanbanListInProgress = document.getElementById('kanban-list-in-progress');
const kanbanListAwaitFeedback = document.getElementById(
  'kanban-list-await-feedback'
);
const kanbanListDone = document.getElementById('kanban-list-done');
const taskModal = document.getElementById('task-modal');
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
    // console.log('tasks:', tasks);
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

function renderData(tasksArr, kanbanList) {
  if (tasksArr.length == 0) {
    kanbanList.innerHTML = `<div class="no-tasks-card">No tasks</div>`;
  } else {
    for (let i = 0; i < tasksArr.length; i++) {
      kanbanList.innerHTML += createCardHTML(tasksArr[i]);
    }
  }
}

function clearKanbanLists() {
  kanbanListTodo.innerHTML = '';
  kanbanListInProgress.innerHTML = '';
  kanbanListAwaitFeedback.innerHTML = '';
  kanbanListDone.innerHTML = '';
}

// function controlPrio(prioStatus) {
//   switch (prioStatus) {
//     case urgent:
//       return '../assets/icons/prio-urgent.png';
//     case medium:
//       return '../assets/icons/prio-medium.svg';
//     case low:
//       return '../assets/icons/prio-low.png';
//   }
// }

function getDataForModal(event) {
  const id = event.currentTarget.id;

  for (let element of tasks) {
    if (id == element.id) {
      taskModal.innerHTML = createTaskModalHTML(element);
    }
  }
}

function openTaskModal(event) {
  taskModal.style.display = 'flex';
  getDataForModal(event);
}

function closeTaskModal() {
  taskModal.style.display = 'none';
  // taskModal.innerHTML = '';
}

function openAddTaskModal() {
  addTaskModal.style.display = 'flex';
  // addTaskModal.innerHTML = createAddTaskModalHTML();
}

function closeAddTaskModal() {
  addTaskModal.style.display = 'none';
  clearInputs();
}

function createCardHTML(element) {
  return `
    <div
      class="kanban-card" id="${element.id}"
      onclick="openTaskModal(event)"
      draggable="true"
      ondragstart="drag(event)"
    >
        <div class="card-label-container">
            <div class="card-label" style="background-color: ${
              element.data.bgCategory
            }">${element.data.category}</div>
        </div>
        <div class="task-modal-card-title-container">
          <div class="card-title">${element.data.title}</div>
          <div class="card-description">${element.data.description}</div>
        </div>
        ${checkTaskSubtasks(element)}
        <div class="card-footer">
            <div class="task-collaborators">
            <div class="card-profile-badge-1">AB</div>
            <div class="card-profile-badge-2">BC</div>
            <div class="card-profile-badge-3">CD</div>
            </div>
            <div class="task-prio">
            <img
                src="../assets/icons/prio-${element.data.prio}.png"
                alt="prio icon"
                id="button-${element.data.prio}-img"
            />
            </div>
        </div>
    </div>
    `;
}

function createTaskModalHTML(element) {
  return `
    <div
      class="task-modal-card"
      id="task-modal-card"
      onclick="event.stopPropagation()"
    >
      <div class="task-modal-card-header-container">
        <div class="task-modal-card-category" style="background-color: ${
          element.data.bgCategory
        }">${element.data.category}</div>
        <img
          src="../assets/icons/cancel.png"
          alt="cancel icon"
          onclick="closeTaskModal()"
        />
      </div>
      <div class="task-modal-card-title">${element.data.title}</div>
      <div class="task-modal-card-description">
        ${element.data.description}
      </div>
      <div class="task-modal-card-date">
        <div class="task-modal-card-key">Due date:</div>
        <span class="task-modal-card-date-content">${element.data.date}</span>
      </div>
      <div class="task-modal-card-prio">
        <div class="task-modal-card-key">Priority:</div>
        <span class="task-modal-card-prio-content">${capitalizeFirstLetter(
          element.data.prio
        )}</span>
        <img
          src="../assets/icons/prio-${element.data.prio}.png"
          alt="prio icon"
        />
      </div>
      <div class="task-modal-card-assigned-to">
        Assigned To:
        <div class="task-modal-card-assigned-to-list">
          <div class="task-modal-contact-container">
            <div class="task-modal-contact-profile-img">EM</div>
            <div class="task-modal-contact-name">Emmanuel Mauer</div>
          </div>
          <div class="task-modal-contact-container">
            <div class="task-modal-contact-profile-img">MB</div>
            <div class="task-modal-contact-name">Marcel Bauer</div>
          </div>
        </div>
      </div>
      ${checkTaskModalSubtasks(element)}
      <div class="task-modal-card-buttons">
        <button id="${element.id}" onclick="deleteTask(event)">
          <img
            src="../assets/icons/delete.png"
            alt="delete icon"
          />
          Delete
        </button>
        <div class="task-modal-card-buttons-seperator"></div>
        <button id="${element.id}">
          <img
            src="../assets/icons/edit.png"
            alt="edit icon"
          />
          Edit
        </button>
      </div>
    </div>
  `;
}

function checkTaskSubtasks(task) {
  if (task.data.subtasks && task.data.subtasks.length > 0) {
    return `
      <div class="subtask-progress-bar-container">
        <div class="subtask-progress-bar">
            <div class="subtask-progress-bar-done" style="width: ${renderProgressBar(
              task
            )}px"></div>
        </div>
        <div class="subtask-counter">1/2 Subtasks</div>
      </div>
    `;
  } else {
    return '';
  }
}

function checkTaskModalSubtasks(task) {
  if (task.data.subtasks && task.data.subtasks.length > 0) {
    return `
    <div class="task-modal-card-subtasks" id="task-modal-card-subtasks">
      Subtasks:
      <div class="task-modal-card-subtasks-list" id="task-modal-card-subtasks-list" >
        ${renderSubtasksOnTaskModal(task)}
      </div>
  </div>`;
  } else {
    return '';
  }
}

// TODO: replace "1" with checked subtasks length
function renderProgressBar(task) {
  const subtasks = task.data.subtasks;
  let progressDone = (128 / subtasks.length) * 1;

  return progressDone;
}

function renderSubtasksOnTaskModal(task) {
  const subtasksArr = task.data.subtasks;
  let subtasksHTML = '';

  for (let i = 0; i < subtasksArr.length; i++) {
    subtasksHTML += `
      <div class="task-modal-subtask-container" id="subtask-${i}">
        <img
          src="../assets/icons/checkbox-empty.svg"
          alt="checkbox icon"
          onclick="setSubtaskChecked(${i})"
        />
        ${subtasksArr[i].name}
      </div>
    `;
  }
  return subtasksHTML;
}

function setSubtaskChecked(id) {
  // chance icon
  // save subtask checked to tasks arr
  // pushToFirebase
  // renderBoard
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

async function deleteTask(event) {
  const taskId = event.target.id;

  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'DELETE',
  });

  closeTaskModal();
  renderBoard();
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

renderBoard();

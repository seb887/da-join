// DOM ELEMENTS
const kanbanListTodo = document.getElementById('kanban-list-todo');
const kanbanListInProgress = document.getElementById('kanban-list-in-progress');
const kanbanListAwaitFeedback = document.getElementById(
  'kanban-list-await-feedback'
);
const kanbanListDone = document.getElementById('kanban-list-done');
const modal = document.getElementById('modal');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';
const tasks = [];
let currentDraggedElementId = '';

async function render() {
  await loadTasksFromFirebase();
  // clearKanbanLists();
}

async function loadTasksFromFirebase() {
  let response = await fetch(BASE_URL + 'tasks' + '.json');
  let tasksDataFromFirebase = await response.json();

  if (tasksDataFromFirebase == null) {
    return;
  } else {
    tasks.length = 0;
    pushTasksFromFirebaseToArr(tasksDataFromFirebase);
  }
}

function pushTasksFromFirebaseToArr(tasksDataFromFirebase) {
  let objectKeys = Object.keys(tasksDataFromFirebase);

  for (let i = 0; i < objectKeys.length; i++) {
    tasks.push({
      id: objectKeys[i],
      task: tasksDataFromFirebase[objectKeys[i]],
    });
  }

  renderKanbanLists();
}

function renderKanbanLists() {
  clearKanbanLists();

  renderTasks(filterTasks('todo'), kanbanListTodo);
  renderTasks(filterTasks('in progress'), kanbanListInProgress);
  renderTasks(filterTasks('await feedback'), kanbanListAwaitFeedback);
  renderTasks(filterTasks('done'), kanbanListDone);
}

function filterTasks(board) {
  if (board == 'todo') {
    return tasks.filter((t) => t.task.board == 'todo');
  }
  if (board == 'in progress') {
    return tasks.filter((p) => p.task.board == 'in progress');
  }
  if (board == 'await feedback') {
    return tasks.filter((f) => f.task.board == 'await feedback');
  }
  if (board == 'done') {
    return tasks.filter((d) => d.task.board == 'done');
  }
}

function renderTasks(tasksArr, kanbanList) {
  if (tasksArr.length == 0) {
    kanbanList.innerHTML = `<div class="no-tasks-card">No tasks</div>`;
  } else {
    for (let i = 0; i < tasksArr.length; i++) {
      kanbanList.innerHTML += createCardHTML(tasksArr[i]);
    }
  }
}

function createCardHTML(element) {
  return `
    <div
      class="kanban-card" id="${element.id}"
      onclick="openModal(event)"
      draggable="true"
      ondragstart="drag(event)"
    >
        <div class="card-label-container">
            <div class="card-label">${element.task.category}</div>
        </div>
        <div class="card-title">${element.task.title}</div>
        <div class="card-description">${element.task.description}</div>
        <div class="subtask-progress-bar-container">
            <div class="subtask-progress-bar">
                <div class="subtask-progress-bar-done"></div>
            </div>
            <div class="subtask-counter">1/2 Subtasks</div>
        </div>
        <div class="card-footer">
            <div class="task-collaborators">
            <div class="card-profile-badge-1">AB</div>
            <div class="card-profile-badge-2">BC</div>
            <div class="card-profile-badge-3">CD</div>
            </div>
            <div class="task-prio">
            <img
                src="../assets/icons/prio-medium.png"
                alt="prio icon"
            />
            </div>
        </div>
    </div>
    `;
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
      modal.innerHTML = createModalHTML(element);
    }
  }
}

function openModal(event) {
  modal.style.display = 'flex';
  getDataForModal(event);
}

function closeModal() {
  modal.style.display = 'none';
  modal.innerHTML = '';
}

function createModalHTML(element) {
  return `
    <div
      class="modal-card"
      id="modal-card"
      onclick="event.stopPropagation()"
    >
      <div class="modal-card-header-container">
        <div class="modal-card-category">${element.task.category}</div>
        <img
          src="../assets/icons/cancel.png"
          alt="cancel icon"
          onclick="closeModal()"
        />
      </div>
      <div class="modal-card-title">${element.task.title}</div>
      <div class="modal-card-description">
        ${element.task.description}
      </div>
      <div class="modal-card-date">
        <div class="modal-card-key">Due date:</div>
        <span class="modal-card-date-content">${element.task.date}</span>
      </div>
      <div class="modal-card-prio">
        <div class="modal-card-key">Priority:</div>
        <span class="modal-card-prio-content">Urgent</span>
        <img
          src="../assets/icons/prio-urgent.png"
          alt="prio icon"
        />
      </div>
      <div class="modal-card-assigned-to">
        Assigned To:
        <div class="modal-card-assigned-to-list">
          <div class="modal-contact-container">
            <div class="modal-contact-profile-img">EM</div>
            <div class="modal-contact-name">Emmanuel Mauer</div>
          </div>

          <div class="modal-contact-container">
            <div class="modal-contact-profile-img">MB</div>
            <div class="modal-contact-name">Marcel Bauer</div>
          </div>

          <!-- <div class="modal-contact-container">
            <div class="modal-contact-profile-img"></div>
            <div class="modal-contact-name">Anton Mayer</div>
          </div> -->
        </div>
      </div>
      <div class="modal-card-subtasks">
        Subtasks:
        <div class="modal-card-subtasks-list">
          <div class="modal-subtask-container">
            <img
              src="../assets/icons/checkbox-empty.svg"
              alt="checkbox icon"
            />
            Implement Recipe Recommendation
          </div>
          <div class="modal-subtask-container">
            <img
              src="../assets/icons/checkbox-empty.svg"
              alt="checkbox icon"
            />
            Implement Recipe Recommendation
          </div>
        </div>
      </div>
      <div class="modal-card-buttons">
        <button>
          <img
            src="../assets/icons/delete.png"
            alt="delete icon"
          />
          Delete
        </button>
        <div class="modal-card-buttons-seperator"></div>
        <button>
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

// DRAG AND DROP
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  currentDraggedElementId = event.target.id;
}

function drop(board) {
  for (let element of tasks) {
    if (currentDraggedElementId == element.id) {
      element.task.board = board;
      updateTaskInFirebase(element.id, element.task);
    }
  }

  render();
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

render();

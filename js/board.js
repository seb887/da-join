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

function render() {
  loadTasksFromFirebase();
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

function renderTasks(tasks, kanbanList) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    kanbanList.innerHTML += createCardHTML(task);
  }
}

function createCardHTML(element) {
  // console.log('element id: ', element.id);

  return `
    <div class="kanban-card" id="${element.id}" onclick="openModal(event)">
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

function controlPrio(prioStatus) {
  switch (prioStatus) {
    case urgent:
      return '../assets/icons/prio-urgent.png';
    case medium:
      return '../assets/icons/prio-medium.svg';
    case low:
      return '../assets/icons/prio-low.png';
  }
}

function getDataForModal(event) {
  const id = event.currentTarget.id;

  for (let element of tasks) {
    if (id == element.id) {
      let task = element.task;
      let title = task.title;
      let description = task.description;
      let date = task.date;
      let category = task.category;

      modal.innerHTML = createModalHTML(title, description, date, category);
    }
  }
}

function openModal(event) {
  modal.style.display = 'flex';
  getDataForModal(event);
  console.log(event.currentTarget.id);
}

function closeModal() {
  modal.style.display = 'none';
  modal.innerHTML = '';
}

function createModalHTML(title, description, date, category) {
  return `
    <div
      class="modal-card"
      id="modal-card"
    >
      <div class="modal-card-header-container">
        <div class="modal-card-category">${category}</div>
        <img
          src="../assets/icons/cancel.png"
          alt="cancel icon"
          onclick="closeModal()"
        />
      </div>
      <div class="modal-card-title">${title}</div>
      <div class="modal-card-description">
      ${description}
      </div>
      <div class="modal-card-date">
        <div class="modal-card-key">Due date:</div>
        <span class="modal-card-date-content">${date}</span>
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

// DRAG N DROP
function renderKanbanLists() {
  let todo = tasks.filter((element) => element.task.board == 'todo');
  let inProgress = tasks.filter(
    (element) => element.task.board == 'in progress'
  );
  let awaitFeedback = tasks.filter(
    (element) => element.task.board == 'await feedback'
  );
  let done = tasks.filter((element) => element.task.board == 'done');

  clearKanbanLists();
  renderCardHTML(todo, inProgress, awaitFeedback, done);
}

function renderCardHTML(todo, inProgress, awaitFeedback, done) {
  for (let i = 0; i < todo.length; i++) {
    kanbanListTodo.innerHTML += createCardHTML(todo[i]);
  }

  for (let i = 0; i < inProgress.length; i++) {
    kanbanListInProgress.innerHTML += createCardHTML(inProgress[i]);
  }

  for (let i = 0; i < awaitFeedback.length; i++) {
    kanbanListAwaitFeedback.innerHTML += createCardHTML(awaitFeedback[i]);
  }

  for (let i = 0; i < done.length; i++) {
    kanbanListDone.innerHTML += createCardHTML(done[i]);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]['category'] = category;
  updateHTML();
}

render();

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

const taskModalSubtasks = document.getElementById('task-modal-card-subtasks');
const taskModalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);
const contactContainer = document.getElementById('assigned-contacts-list');

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
  clearInputs();
  setActiveUserInitials();
  listContactsToAssignedTo();
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

function openTaskModal(event, id) {
  taskModal.style.display = 'flex';
  taskModalCard.style.display = 'flex';
  modalSlideInOrOut('task-modal-card');
  getDataForSingleTask(event);
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
  renderBoard();
}

function openAddTaskModal(kanbanBoard) {
  addTaskModal.style.display = 'flex';

  currentKanbanBoard = kanbanBoard;
  modalSlideInOrOut('add-task-modal-card');
}

function closeAddTaskModal() {
  modalSlideInOrOut('add-task-modal-card');
  setTimeout(() => {
    addTaskModal.style.display = 'none';
  }, 250);
  clearInputs();
}

function cancelAddTask() {
  clearInputs();
  closeAddTaskModal();
}

function renderSubtaskProgressBar(task) {
  if (task.data.subtasks && task.data.subtasks.length > 0) {
    return `
      <div class="subtask-progress-bar-container">
        <div class="subtask-progress-bar">
            <div class="subtask-progress-bar-done" style="width: ${calcSubtaskProgressBar(task)}%"></div>
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

async function renderAssignedToInCard(taskId, task, path = '') {
  let card = document.getElementById(path + taskId);
  card.innerHTML = '';
  if (task.data.assignedTo == undefined) {
    return;
  } else {
    task.data.assignedTo.forEach((assignedContact, index) => {
      if (index < 4) {
        card.innerHTML += `
        <div style="background-color:${assignedContact.color}" id="${
          assignedContact.id + '-cpb'
        }" class="card-profile-badge-3">${assignedContact.initials}</div>
        `;
      } else if (index == 4) {
        card.innerHTML += `
        <div style="background-color:#2A3647; text-align: center;" id="${
          assignedContact.id + '-cpb'
        }" class="card-profile-badge-3">+${
          task.data.assignedTo.length - 4
        }</div>
        `;
      }
    });
  }
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

async function displayTaskModalContacts(id) {
  let container = document.getElementById('task-modal-assigned-contacts');
  container.innerHTML = '';
  tasks.forEach((task) => {
    if (task.data.assignedTo && task.id == id) {
      task.data.assignedTo.forEach((assignedContact) => {
        container.innerHTML += `
        <div class= "task-modal-assigned-contacts-container">
          <div style="background-color:${assignedContact.color}"class="task-modal-contact-profile-img">${assignedContact.initials}</div>
          <div class="task-modal-contact-name">${assignedContact.name}</div>
        </div> `;
      });
    }
  });
}

async function listContactsToAssignedToinBoard() {
  let allContacts = Object.values(await getContacts());
  let id = Object.keys(await getContacts());
  renderedContacts = [];
  allContacts.forEach((contact, index) => {
    contact.id = id[index];
  });
  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  contactContainer.innerHTML = '';
  allContacts.forEach((contact, index) => {
    contactContainer.innerHTML += assignedToContactsContent(contact);
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
    renderedContacts.push(contact);
  });
}

function dropDownContactsEditTask() {
  const contactList = document.getElementById('assigned-contacts-list');
  const container = document.getElementById('task-modal-card');

  container.addEventListener('click', (e) => {});
  if (contactList.style.display == 'flex') {
    closeDropdownMenu(contactList);
  } else {
    openDropdownMenu(contactList);
  }
}

function closeDropdownMenu(contactList) {
  contactList.style.display = 'none';
  document.getElementById('searchContact-board').placeholder =
    'Select contacts to assign';
  document.getElementById('arrowAssignTo').src =
    '../assets/icons/arrow-down.png';
}

function openDropdownMenu(contactList) {
  contactList.style.display = 'flex';
  document.getElementById('searchContact-board').placeholder = '';
  document.getElementById('arrowAssignTo').src = '../assets/icons/arrow-up.png';
}

function checkIfAnimationActiveBoard() {
  let modal = document.getElementById('addContact');
  if (animationActive) {
    modal.classList.remove('animation-slide-in');
    modal.classList.add('animation-slide-out');
    setTimeout(() => {
      modal.style.display = 'none';
      document.getElementById('modalBackground').style.display = 'none';
    }, 250);
  } else {
    modal.classList.remove('animation-slide-out');
    modal.classList.add('animation-slide-in');
    document.getElementById('modalBackground').classList.add('change-opacity');
  }
}

function modalSlideInOrOut(modalId) {
  if (!modalActive) {
    document.getElementById(modalId).classList.add('task-modal-slide-in');
    document.getElementById(modalId).classList.remove('task-modal-slide-out');
    document.body.style.overflow = 'hidden';
  } else {
    document.getElementById(modalId).classList.remove('task-modal-slide-in');
    document.getElementById(modalId).classList.add('task-modal-slide-out');
    document.body.style.overflow = 'unset';
  }
  modalActive = !modalActive;
  setTimeout(() => {
    document.getElementById(modalId).classList.remove('task-modal-slide-in');
    document.getElementById(modalId).classList.remove('task-modal-slide-out');
  }, 350);
}

function selectAllAssignedContacts(taskId) {
  document.getElementById('assigned-contacts-list').innerHTML = '';
  tasks.forEach((task) => {
    if (task.data.assignedTo && task.id == taskId) {
      task.data.assignedTo.forEach((contact) => {
        document.getElementById(contact.id + 'cb').checked = true;
        inspectCheckboxes('assigned-contacts-list');
      });
    }
  });
}

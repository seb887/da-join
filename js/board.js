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
let sContactBoardAddTask = document.getElementById('searchContact-board-addTask');
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
  removeAssignedList();
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

//showInfoToast('Task added to board') should be moved to the addTask function after creation
function showInfoToast(text) {
  // event.preventDefault();
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
  if(sContactBoard)
    {
      sContactBoard.placeholder = 'Select contacts to assign';
      sContactBoardAddTask.placeholder = 'Select contacts to assign';
      document.getElementById('arrowAssignTo').src = '../assets/icons/arrow-down.png';
      document.getElementById('arrowAssignToAddTask').src = '../assets/icons/arrow-down.png';
    }
  else if(sContactAdd){
      sContactAdd.placeholder = 'Select contacts to assign';
      document.getElementById('arrowAssignTo').src = '../assets/icons/arrow-down.png';
  } 
  
}

function openDropdownMenu(contactList) {
  contactList.style.display = 'flex';
  if (sContactAdd) {
    sContactAdd.placeholder = ''
    document.getElementById('arrowAssignTo').src = '../assets/icons/arrow-up.png';
  }
  else if(sContactBoard){
    sContactBoard.placeholder = ''
    sContactBoardAddTask.placeholder = ''
    document.getElementById('arrowAssignTo').src = '../assets/icons/arrow-up.png';
    document.getElementById('arrowAssignToAddTask').src = '../assets/icons/arrow-up.png';
  }
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
        document.getElementById(contact.id + 'cb') ? document.getElementById(contact.id + 'cb').checked = true: null ;
        inspectCheckboxes('assigned-contacts-list');
      });
    }
  });
}

 window.onscroll = function (ev) {
  const scrollPosition = window.innerHeight + Math.round(window.scrollY);
  const totalHeight = document.documentElement.scrollHeight;
  if (scrollPosition >= totalHeight) {
    document.getElementById('footer').classList.add('footer-animation');
  } else {
    document.getElementById('footer').classList.remove('footer-animation');
  }
};

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

function renderContactsinAddTask(){
  let list = document.getElementById('input-assigned-to-addTask')
  renderedContacts.forEach((contact) =>{
    list.innerHTML += assignedToContactsContent(contact) 
  })
}


async function createCompareArray(){
  let taskArray = [];
  tasks.forEach((task, index) =>{
    if(task.data.assignedTo){
    task.data.assignedTo.forEach(element => {
      renderedContacts.forEach((contact) =>{
        if(contact.id == element.id){
          let arr = [{
            pattern : contact , 
            example : element,
            taskId : task.id
          }]
          taskArray.push(arr)
        }
        else{ return }
      })
    }); 
    }
  })
  return taskArray;
} 


async function compareArray(){
  let comparsion = await createCompareArray();
  let assignedContactsToUpdate = [];
  comparsion.forEach((element) =>{
    let example = element[0]['example'];
    let pattern = element[0]['pattern'];
      example['name'] !== pattern['name'] ? assignedContactsToUpdate.push({taskId : element[0]['taskId'], contactId : pattern['id']}) : null
      example['email'] !== pattern['email'] ? assignedContactsToUpdate.push({taskId : element[0]['taskId'], contactId : pattern['id']}) :null      
      example['initials'] !== pattern['initials'] ? assignedContactsToUpdate.push({taskId : element[0]['taskId'], contactId : pattern['id']}) :null     
      example['phone'] !== pattern['phone'] ? assignedContactsToUpdate.push({taskId : element[0]['taskId'], contactId : pattern['id']}) :null
  })
  return assignedContactsToUpdate;
}


async function findMatchInRenderedContacts(contactId){
  let indexOfRenderedContact = '';
  renderedContacts.forEach((contact, index) => {
    let match = contact.id.match(contactId);
    if(match != null){
      indexOfRenderedContact = index
    }                       
  })
  return indexOfRenderedContact
}


async function findIndexInTaskAssignedTo(taskId, contactId){
  let indexInAssignedTo = '';
 tasks.forEach((task) =>{
 if(taskId == task.id){
  task.data.assignedTo.forEach((contact, index) =>{
    if(contact.id == contactId){
        indexInAssignedTo = index;
    }
  })
 }
 })
 return indexInAssignedTo
}

async function updateComparedTasks(contactId, taskId){
  let assignedContactsToUpdate = await compareArray();
  if(assignedContactsToUpdate.length > 0){
    console.log('Tasks updated.');
    assignedContactsToUpdate.forEach(async(contact, index) =>{
    let contactToPut = renderedContacts[await findMatchInRenderedContacts(contact.contactId)]
    let fetchURL = BASE_URL + 'tasks/' + contact.taskId + '/assignedTo/' + await findIndexInTaskAssignedTo(contact.taskId, contact.contactId) + '.json'
    await fetch(fetchURL ,{
      method: 'PUT',
      body: JSON.stringify(contactToPut)
    })    
  })
  await renderBoard();
}
else{
  return
}
}


function renderAllContactsInAddTask(){
  let inputChild = document.querySelector("#input-assigned-to-addTask > label:nth-child(1)");
  inputAssignedTo.innerHTML = '';
  document.getElementById('assigned-contacts-list').innerHTML = ''
  inputATAT.innerHTML = ''
  renderedContacts.forEach((contact) =>{ 
    inputATAT.innerHTML += assignedToContactsContentAddTask(contact);
    setBackgroundColor(contact);
  })
}



function inspectCheckboxesAddTask(path) {
  let allDivs = document.getElementById('input-assigned-to-addTask');
  assignedContacts = []; 
  allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
    if (cb.checked) {      
      assignedContacts.push(cb.value);
      cb.parentElement.parentElement.classList.add('selected');
      renderAssignedContacts('assigned-contacts-list-addTask');
    }
    if (!cb.checked) {
      cb.parentElement.parentElement.classList.remove('selected');
      renderAssignedContacts('assigned-contacts-list-addTask');
    }
  });
}// greift auf input-assigned-to zu nicht auf input-assigned-to-addTask


function removeAssignedList(){
  inputAssignedTo.innerHTML = '';
  document.getElementById('assigned-contacts-list').innerHTML = ''
  inputATAT.innerHTML = ''
}

function showOrHideContactsOnInputInBoard(path) {
  let arrow = document.getElementById('arrowAssignTo');
  let arrowAddTask  = document.getElementById('arrowAssignToAddTask');
  let allDivs = document.getElementById(path);
  const contactList = document.getElementById(path);
  if (input1.value.length > 0 || input2.value.length > 0) {
    contactList.style.display = 'flex';
    arrow.src ='../assets/icons/arrow-up.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = 'none';
    });
    return true;
  } else {
    document.getElementById(path).style.display = 'none';
    arrow.src ='../assets/icons/arrow-down.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = '';
    });
    return false;
  }
}

function displayMatchingContactsInBoard() {
  
  renderedContacts.forEach((contact) => {
    if (contact.name.toLowerCase().slice(0, 2) == input1.value.toLowerCase().slice(0, 2)){
      document.getElementById( `${contact.id}cb`).parentElement.parentElement.style.display = '';
    }
    else if (contact.name.toLowerCase().slice(0, 2) == input2.value.toLowerCase().slice(0, 2)){ 
      document.getElementById( `${contact.id}cb`).parentElement.parentElement.style.display = ''; 
    }
  });
}

function filterContactsInBoard(path) {
  if (showOrHideContactsOnInputInBoard(path)) {
    displayMatchingContactsInBoard(path);
  }
}

function clearAssignedContacts(){
  document.getElementById('assigned-contacts-list-addTask').innerHTML = '';
  input1 ? input1.value = '': null ;
  input2 ? input2.value = '' : null;
  if(inputATAT.style.display = 'flex'){
    dropDownContacts('searchContact-board-addTask', 1)
  }
}

function assignedToContactsContentAddTask(contact, id, index) {
  return `
  <label for ="${contact['id']}cb">
      <div class ="add-task-contact-list">
        <div>
          <div id= "${contact['id']}-container" class= "initial-div">${contact['initials']}</div>
          <div>${contact['name']}</div>
        </div>
        <input onchange ="inspectCheckboxesAddTask('assigned-contacts-list-addTask')" value="${contact['id']}cb" id="${contact['id']}cb" type ="checkbox">
      </div>
  </label>
    `;
}
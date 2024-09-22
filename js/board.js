// DOM ELEMENTS
const kanbanListTodo = document.getElementById('kanban-list-todo');
const kanbanListInProgress = document.getElementById('kanban-list-in-progress');
const kanbanListAwaitFeedback = document.getElementById(
  'kanban-list-await-feedback'
);
const kanbanListDone = document.getElementById('kanban-list-done');

// VARIABLES
const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/';

const tasks = [
  // {
  //   category: 'User Story',
  //   title: 'Kochwelt Page & Recipe Recommender',
  //   description: 'Build start page with recipe recommendation...',
  //   collaborators: ['Jim Panse', 'Anne Theke', 'Kara Mell'],
  //   prio: 'medium',
  //   board: 'in progress',
  // },
  // {
  //   category: 'Technical Task',
  //   title: 'HTML Base Template Creation',
  //   description: 'Create reusable HTML base templates..',
  //   collaborators: ['Anne Theke', 'Kara Mell'],
  //   prio: 'low',
  //   board: 'await feedback',
  // },
  // {
  //   category: 'User Story',
  //   title: 'Daily Kochwelt Recipe',
  //   description: 'Implement daily recipe and portion calculator....',
  //   collaborators: ['Jim Panse', 'Anne Theke', 'Kara Mell'],
  //   prio: 'medium',
  //   board: 'in progress',
  // },
  // {
  //   category: 'Technical Task',
  //   title: 'CSS Architecture Planning',
  //   description: 'Define CSS naming conventions and structure...',
  //   collaborators: ['Jim Panse', 'Anne Theke', 'Kara Mell'],
  //   prio: 'urgent',
  //   board: 'done',
  // },
];

function render() {
  loadTasksFromFirebase();
  clearKanbanLists();
  renderKanbanLists();
}

function renderKanbanLists() {
  for (let i = 0; i < tasks.length; i++) {
    switch (tasks[i].board) {
      case 'todo':
        kanbanListTodo.innerHTML += createCardHTML(tasks[i]);
        break;
      case 'in progress':
        kanbanListInProgress.innerHTML += createCardHTML(tasks[i]);
        break;
      case 'await feedback':
        kanbanListAwaitFeedback.innerHTML += createCardHTML(tasks[i]);
        break;
      case 'done':
        kanbanListDone.innerHTML += createCardHTML(tasks[i]);
        break;
    }
  }
}

function createCardHTML(task) {
  return `
    <div class="kanban-card">
        <div class="card-label-container">
            <div class="card-label">${task.category}</div>
        </div>
        <div class="card-title">${task.title}</div>
        <div class="card-description">${task.description}</div>
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

// function controlLabel(label) {
//   switch (label) {
//     case 'User Story':
//       console.log(parentNode);
//   }
// }

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
}

render();

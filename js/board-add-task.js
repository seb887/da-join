// DOM ELEMENTS
const boardInputTitle = document.getElementById('board-input-title');
const boardInputDescription = document.getElementById(
  'board-input-description'
);
const boardInputDate = document.getElementById('board-input-date');
const boardSubtasksList = document.getElementById('board-subtasks-list');

// const addSubtasksImg = document.getElementById('add-subtask-img');
// const submitSubtasksImg = document.getElementById('submit-subtask-img');
// const cancelSubtasksImg = document.getElementById('cancel-subtask-img');

const boardInputSubtask = document.getElementById('board-input-subtask');
const boardButtonLow = document.getElementById('board-button-low');
const boardButtonMedium = document.getElementById('board-button-medium');
const boardButtonUrgent = document.getElementById('board-button-urgent');
const boardButtonLowImg = document.getElementById('board-button-low-img');
const boardButtonMediumImg = document.getElementById('board-button-medium-img');
const boardButtonUrgentImg = document.getElementById('board-button-urgent-img');

function boardCreateNewTask() {
  let newTask = {
    title: boardInputTitle.value,
    description: boardInputDescription.value,
    date: boardInputDate.value,
    // category: selectCategory.value,
    board: currentKanbanBoard,
    // prio: currentPrio,
    subtasks: subtasks,
    assignedTo: matches,
  };
}
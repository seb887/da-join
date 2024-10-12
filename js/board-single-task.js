// DOM ELEMENTS

const taskCategory = document.getElementById('task-modal-card-category');
const taskTitle = document.getElementById('task-modal-card-title');
const taskDescription = document.getElementById('task-modal-card-description');
const taskDate = document.getElementById('task-modal-card-date-content');
const taskPrio = document.getElementById('task-modal-card-prio-content');
const taskPrioImg = document.getElementById('task-modal-card-prio-img');
const modalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);
const taskDeleteBtn = document.getElementById('task-delete-button');
const taskEditBtn = document.getElementById('task-edit-button');

// VARIABLES

// FUNCTIONS
function getDataForSingleTask(event) {
  const id = event.currentTarget.id;

  for (let element of tasks) {
    if (id == element.id) {
      renderSingleTaskModal(element);
    }
  }
}

function renderSingleTaskModal(task) {
  taskCategory.innerHTML = task.data.category;
  taskCategory.style.backgroundColor = setCategoryBackgroundColor(
    task.data.category
  );
  taskTitle.innerHTML = task.data.title;
  taskDescription.innerHTML = task.data.description;
  taskDate.innerHTML = task.data.date;
  taskPrio.innerHTML = capitalizeFirstLetter(task.data.prio);
  taskPrioImg.src = setPrioImg(task.data.prio);
  modalSubtasksList.innerHTML = renderSubtasksModal(task);
  taskDeleteBtn.onclick = () => deleteTask(task.id);
  taskEditBtn.onclick = () => openEditTaskModal(task.id);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function setPrioImg(prio) {
  if (prio == 'urgent') {
    return `../assets/icons/prio-urgent.png`;
  } else if (prio == 'medium') {
    return `../assets/icons/prio-medium.png`;
  } else if (prio == 'low') {
    return `../assets/icons/prio-low.png`;
  }
}

function renderSubtasksModal(task) {
  const subtasksArr = task.data.subtasks;
  let taskId = task.id;
  let subtasksHTML = '';

  checkSubtasksArr(subtasksArr);

  for (let i = 0; i < subtasksArr.length; i++) {
    console.log('renderSubtasks', taskId, i);

    subtasksHTML += `
            <div class="task-modal-subtask-container">
              <img
                src="../assets/icons/checkbox-empty.svg"
                alt="checkbox icon"
                onclick="setSubtaskChecked('${taskId}', '${i}')"
              />
              ${subtasksArr[i].title}
            </div>
          `;
  }
  return subtasksHTML;
}

function checkSubtasksArr(subtasksArr) {
  if (subtasksArr == undefined) {
    taskModalSubtasks.style.display = 'none';
  } else {
    taskModalSubtasks.style.display = 'flex';
  }
}

// TODO: ANPASSEN
function setSubtaskChecked(taskId, subtaskId) {
  // set subtask checked in tasks arr (only for test)
  for (let element of tasks) {
    if (element.id == taskId) {
      element.data.subtasks[subtaskId].checked =
        !element.data.subtasks[subtaskId].checked;
      console.log(tasks);
    }
  }

  // checked subtask directly pushToFirebase
  // change icon to checked in task modal
  // renderBoard
}

async function deleteTask(id) {
  const taskId = id;

  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'DELETE',
  });

  closeTaskModal();
  renderBoard();
}

function openEditTaskModal(id) {
  const taskId = id;
  console.log(taskId);
  taskModalCard.style.display = 'none';
  taskModalEditCard.style.display = 'flex';

  //   for (let element of tasks) {
  //     if (taskId == element.id) {
  //       // console.log('task modal element id:', element.id);
  //       taskModal.innerHTML = createEditTaskModalHTML(element);
  //     }
  //   }
}

async function editTask(event) {
  const taskId = event.target.id;
  getEditInputs();

  for (let element of tasks) {
    if (taskId == element.id) {
      element.data.title = inputTitle.value;
      element.data.description = inputDescription.value;
      element.data.date = inputDate.value;
      element.data.prio = currentPrio;

      await updateTaskInFirebase(element.id, element.data);
      closeTaskModal();
      renderBoard();
    }
  }
}

function setCategoryBackgroundColor(category) {
  if (category == 'User Story') {
    return '#0038FF';
  } else if (category == 'Technical Task') {
    return '#1FD7C1';
  }
}

// DOM ELEMENTS
const editInputTitle = document.getElementById('edit-input-title');
const editInputDescription = document.getElementById('edit-input-description');
const editInputDate = document.getElementById('edit-input-date');
const editInputSubtask = document.getElementById('edit-input-subtask');
const taskCategory = document.getElementById('task-modal-card-category');
const taskTitle = document.getElementById('task-modal-card-title');
const taskDescription = document.getElementById('task-modal-card-description');
const taskDate = document.getElementById('task-modal-card-date-content');
const taskPrio = document.getElementById('task-modal-card-prio-content');
const taskPrioImg = document.getElementById('task-modal-card-prio-img');
const modalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);
const editSubtaskList = document.getElementById('edit-subtasks-list');
const taskDeleteBtn = document.getElementById('task-delete-button');
const taskEditBtn = document.getElementById('task-edit-button');
const editTaskSubmitBtn = document.getElementById('edit-task-submit-button');

// VARIABLES

// FUNCTIONS
function getDataForSingleTask(event) {
  const id = event.currentTarget.id;

  for (let element of tasks) {
    if (id == element.id) {
      renderSingleTaskModal(element);
      console.log('single task', element.id);
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
  let subtasksArr = task.data.subtasks;
  let taskId = task.id;
  let subtasksHTML = '';

  if (subtasksArr == undefined) {
    taskModalSubtasks.style.display = 'none';
    return;
  } else {
    taskModalSubtasks.style.display = 'flex';

    for (let i = 0; i < subtasksArr.length; i++) {
      if (subtasksArr[i].checked) {
        subtasksHTML += `
        <div class="task-modal-subtask-container">
          <img
            src="../assets/icons/checkbox-checked.svg"
            alt="checkbox icon"
            onclick="setSubtaskStatus('${taskId}', '${i}')"
          />
          ${subtasksArr[i].title}
        </div>
    `;
      } else {
        subtasksHTML += `
        <div class="task-modal-subtask-container">
          <img
            src="../assets/icons/checkbox-empty.svg"
            alt="checkbox icon"
            onclick="setSubtaskStatus('${taskId}', '${i}')"
          />
          ${subtasksArr[i].title}
        </div>
      `;
      }
    }
  }
  return subtasksHTML;
}

function checkSubtasksArr(subtasksArr) {
  if (subtasksArr == undefined) {
    taskModalSubtasks.style.display = 'none';
    return;
  } else {
    taskModalSubtasks.style.display = 'flex';
  }
}

async function setSubtaskStatus(taskId, subtaskId) {
  for (let element of tasks) {
    if (element.id == taskId) {
      element.data.subtasks[subtaskId].checked =
        !element.data.subtasks[subtaskId].checked;

      await updateTaskInFirebase(element.id, element.data);
      renderSingleTaskModal(element);
    }
  }
}

async function deleteTask(id) {
  const taskId = id;

  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'DELETE',
  });

  closeTaskModal();
  renderBoard();
}

function openEditTaskModal(taskId) {
  taskModalCard.style.display = 'none';
  taskModalEditCard.style.display = 'flex';
  for (let element of tasks) {
    if (taskId == element.id) {
      editInputTitle.value = element.data.title;
      editInputDescription.value = element.data.description;
      editInputDate.value = element.data.date;
      currentPrio = element.data.prio;
      controlPrioButtonStyle();
      subtasks = element.data.subtasks;
      renderSubtasksList(editSubtaskList, taskId);
      editTaskSubmitBtn.onclick = () => editTask(taskId);
    }
  }
}

async function editTask(taskId) {
  console.log('edited', taskId);
  for (let element of tasks) {
    if (taskId == element.id) {
      element.data.title = editInputTitle.value;
      element.data.description = editInputDescription.value;
      element.data.date = editInputDate.value;
      element.data.prio = currentPrio;
      element.data.assignedTo = getSelectedContactsEditTask();

      await updateTaskInFirebase(element.id, element.data);
      closeTaskModal();
      openTaskModal(taskId);
      renderBoard();
      renderAssignedContacts('assigned-contacts-list');
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

function getSelectedContactsEditTask() {
  let selectedContacts = [];
  let matchArray = renderedContacts.filter((contact) =>
    assignedContacts.some((id) => id.slice(0, -2) === contact.id)
  );
  matchArray.forEach((match, index) => {
    selectedContacts.push(match);
  });
  return selectedContacts;
}

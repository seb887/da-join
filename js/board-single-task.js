// DOM ELEMENTS
const editInputTitle = document.getElementById('edit-input-title');
const editInputDescription = document.getElementById('edit-input-description');
const editInputDate = document.getElementById('edit-input-date');
const editInputSubtask = document.getElementById('edit-input-subtask');
const editAddSubtasksImg = document.getElementById('edit-add-subtask-img');
const editSubmitSubtasksImg = document.getElementById(
  'edit-submit-subtask-img'
);
const editCancelSubtasksImg = document.getElementById(
  'edit-cancel-subtask-img'
);

const taskCategory = document.getElementById('task-modal-card-category');
const taskTitle = document.getElementById('task-modal-card-title');
const taskDescription = document.getElementById('task-modal-card-description');
const taskDate = document.getElementById('task-modal-card-date-content');
const taskPrio = document.getElementById('task-modal-card-prio-content');
const taskPrioImg = document.getElementById('task-modal-card-prio-img');
const modalSubtasksList = document.getElementById(
  'task-modal-card-subtasks-list'
);
const editSubtasksList = document.getElementById('edit-subtasks-list');
const taskDeleteBtn = document.getElementById('task-delete-button');
const taskEditBtn = document.getElementById('task-edit-button');
const editTaskSubmitBtn = document.getElementById('edit-task-submit-button');

// VARIABLES

let isEditOn = false;

// FUNCTIONS
async function updateTaskInFirebase(taskId, updatedTask) {
  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
  });
}

function getDataForSingleTask(id) {
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

async function openEditTaskModal(taskId) {
  taskModalCard.style.display = 'none';
  taskModalEditCard.style.display = 'flex';
  isEditOn = true;

  editInputTitle.value = "";
  editInputDescription.value = "";
  editInputDate.value = "";
  currentPrio = null;
  subtasks = [];
  renderSubtasksList([]);

  const contactsPromise = listContactsToAssignedTo();

  const task = tasks.find(element => element.id === taskId);

  if (task) {
    editInputTitle.value = task.data.title;
    editInputDescription.value = task.data.description;
    editInputDate.value = task.data.date;
    currentPrio = task.data.prio;
    subtasks = task.data.subtasks || [];

    setPrio(currentPrio);
    renderSubtasksList(taskId);

    editTaskSubmitBtn.onclick = () => editTask(taskId);
  }

  await contactsPromise;
  selectAllAssignedContacts(taskId);
  hideSubtaskIcons();
}


function closeEditTaskModal() {
  taskModalCard.style.display = 'flex';
  taskModalEditCard.style.display = 'none';
}

async function editTask(taskId) {
  for (let element of tasks) {
    if (taskId == element.id) {
      element.data.title = editInputTitle.value;
      element.data.description = editInputDescription.value;
      element.data.date = editInputDate.value;
      element.data.prio = currentPrio;
      element.data.subtasks = subtasks;
      element.data.assignedTo = getSelectedContactsEditTask();

      await updateTaskInFirebase(element.id, element.data);
      closeEditTaskModal();
      // FIXME: disable animation, if change from edit task modal to default task modal
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
  } else if (category == 'Tutorial') {
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

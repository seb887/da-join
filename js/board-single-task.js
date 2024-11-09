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

/**
 * Updates a task in Firebase with the specified task ID and updated task data
 *
 * @param {string} taskId - The identifier of the task to be updated
 * @param {Object} updatedTask - The updated task data to be sent to Firebase
 */
async function updateTaskInFirebase(taskId, updatedTask) {
  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
  });
}

/**
 * Retrieves data for a single task by its ID and renders it in a modal
 *
 * @param {string} id - The unique identifier of the task to retrieve
 */
function getDataForSingleTask(id) {
  for (let element of tasks) {
    if (id == element.id) {
      renderSingleTaskModal(element);
    }
  }
}

/**
 * Renders the details of a single task in a modal window
 *
 * @param {Object} task - The task object containing details to be displayed
 */
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

/**
 * Capitalizes the first letter of a given string
 *
 * @param {string} string - The string to capitalize
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Returns the file path for the priority image based on the priority level
 *
 * @param {string} prio - The priority level of the task
 */
function setPrioImg(prio) {
  if (prio == 'urgent') {
    return `../assets/icons/prio-urgent.png`;
  } else if (prio == 'medium') {
    return `../assets/icons/prio-medium.png`;
  } else if (prio == 'low') {
    return `../assets/icons/prio-low.png`;
  }
}

/**
 * Renders the subtasks of a given task in the modal and returns the HTML for the subtasks
 * If the task has no subtasks, the subtasks section will be hidden
 *
 * @param {Object} task - The task object containing subtasks to be rendered
 */
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

/**
 * Checks if the subtasks array is defined and adjusts the visibility of the task modal subtasks section
 * If the subtasks array is undefined, the subtasks section will be hidden. Otherwise, it will be displayed
 *
 * @param {Array|undefined} subtasksArr - The array of subtasks or `undefined` if no subtasks are present
 */
function checkSubtasksArr(subtasksArr) {
  if (subtasksArr == undefined) {
    taskModalSubtasks.style.display = 'none';
    return;
  } else {
    taskModalSubtasks.style.display = 'flex';
  }
}

/**
 * Toggles the completion status of a specific subtask and updates it in the Firebase database
 * After updating, the function re-renders the task in the modal
 *
 * @param {string} taskId - The ID of the task containing the subtask to update
 * @param {number} subtaskId - The index of the subtask in the task's subtasks array
 */
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

/**
 * Deletes a task from the Firebase database using its ID, then closes the task modal and re-renders the board
 *
 * @param {string} taskId - The ID of the task to be deleted
 */
async function deleteTask(taskId) {
  await fetch(BASE_URL + 'tasks/' + taskId + '.json', {
    method: 'DELETE',
  });

  closeTaskModal();
  await renderBoard();
}

/**
 * Opens the edit modal for a specific task, populating it with the task's details for editing
 * Initializes the input fields, priority, subtasks, and contacts associated with the task
 *
 * @param {string} taskId - The ID of the task to be edited
 */
async function openEditTaskModal(taskId) {
  taskModalCard.style.display = 'none';
  taskModalEditCard.style.display = 'flex';
  isEditOn = true;

  editInputTitle.value = '';
  editInputDescription.value = '';
  editInputDate.value = '';
  currentPrio = null;
  subtasks = [];
  renderSubtasksList([]);
  const contactsPromise = listContactsToAssignedTo();

  const task = tasks.find((element) => element.id === taskId);

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

/**
 * Closes the edit task modal and displays the regular task modal
 */
function closeEditTaskModal() {
  taskModalCard.style.display = 'flex';
  taskModalEditCard.style.display = 'none';
}

/**
 * Updates the details of a specified task with the current values from the edit modal
 * The task is then updated in the Firebase database, and the modal view switches back
 * to the default task modal with the updated task details
 *
 * @param {string} taskId - The ID of the task to be updated
 */
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

      // FIXME: disable animation, if change from edit task modal to default task modal
      closeEditTask();
      // openTaskModal(taskId);
      renderBoard();
      renderAssignedContacts('assigned-contacts-list');
    }
  }
}

/**
 * Determines the background color for a task category based on the specified category type
 *
 * @param {string} category - The category of the task
 */
function setCategoryBackgroundColor(category) {
  if (category === 'User Story') {
    return '#0038FF';
  } else if (category === 'Technical Task') {
    return '#1FD7C1';
  } else if (category === 'Tutorial') {
    return '#f14e4e';
  }
}

/**
 * Retrieves a list of selected contacts for the task being edited by matching assigned contact IDs with rendered contacts
 */
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

function closeEditTask(id) {
  taskModal.style.display = 'none';
  taskModalEditCard.style.display = 'none';
  taskModal.style.display = 'flex';
  taskModalCard.style.display = 'flex';
  getDataForSingleTask(id);
  displayTaskModalContacts(id);
}

/**
 * Controls the visibility of subtask icons based on input values
 *
 * @param {string} inputSubtask - The input field for the subtask
 * @param {string} [editInputSubtask] - The optional input field for editing a subtask
 */
function controlSubtaskIcons() {
  if (editInputSubtask == null) {
    if (inputSubtask.value.length > 0) {
      showSubtaskIcons();
    } else {
      hideSubtaskIcons();
    }
  } else {
    if (inputSubtask.value.length > 0 || editInputSubtask.value.length > 0) {
      showSubtaskIcons();
    } else {
      hideSubtaskIcons();
    }
  }
}

/**
 * Toggles the visibility of subtask icons based on the editing state
 * If in edit mode, it shows the edit-related icons and hides the add icon
 * If not in edit mode, it shows the add icon and hides the edit icons
 */
function showSubtaskIcons() {
  if (isEditOn) {
    editAddSubtasksImg.style.display = 'none';
    editSubmitSubtasksImg.style.display = 'flex';
    editCancelSubtasksImg.style.display = 'flex';
  } else {
    addSubtasksImg.style.display = 'none';
    submitSubtasksImg.style.display = 'flex';
    cancelSubtasksImg.style.display = 'flex';
  }
}

/**
 * Hides the subtask icons based on the editing state
 * If in edit mode, it displays the add icon and hides the submit and cancel icons
 * If not in edit mode, it displays the submit and cancel icons and hides the add icon
 */
function hideSubtaskIcons() {
  if (isEditOn) {
    editAddSubtasksImg.style.display = 'flex';
    editSubmitSubtasksImg.style.display = 'none';
    editCancelSubtasksImg.style.display = 'none';
  } else {
    addSubtasksImg.style.display = 'flex';
    submitSubtasksImg.style.display = 'none';
    cancelSubtasksImg.style.display = 'none';
  }
}

/**
 * Clears the input field for subtasks based on the editing state
 * If in edit mode, it clears the edit input for the subtask
 * Otherwise, it clears the main input for adding a new subtask
 *
 * This function also calls `controlSubtaskIcons()` to update the visibility of subtask icons
 */
function cancelInputSubtask() {
  if (isEditOn) {
    editInputSubtask.value = '';
  } else {
    inputSubtask.value = '';
  }

  controlSubtaskIcons();
}

/**
 * Submits a new subtask or updates an existing one based on the edit state
 * Clears the input field after submission and updates the subtask icons
 */
function submitInputSubtask() {
  const subtaskObj = {
    title: isEditOn ? editInputSubtask.value : inputSubtask.value,
    checked: false,
  };

  subtasks.push(subtaskObj);

  if (!isEditOn) {
    inputSubtask.value = '';
  } else {
    editInputSubtask.value = '';
  }

  controlSubtaskIcons();
  renderSubtasksList();
}

/**
 * Renders the list of subtasks based on the current editing state
 * Clears the existing list and populates it with subtasks
 * If no subtasks are defined, it exits early
 *
 * @param {string} taskId - The ID of the task associated with the subtasks
 */
function renderSubtasksList(taskId) {
  let list = subtasksList;

  if (isEditOn) {
    list = editSubtasksList;
  } else {
    list = subtasksList;
  }

  list.innerHTML = '';

  if (subtasks == undefined) {
    return;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      list.innerHTML += createSubtasksListHTML(i, taskId);
    }
  }
}

/**
 * Edits a single subtask by displaying an input field for editing
 * If the taskId is 'undefined', it uses the local subtasks array; otherwise, it fetches the subtask title from the specified task
 *
 * @param {string} taskId - The ID of the task to which the subtask belongs
 *                          If 'undefined', the function uses the subtasks array directly
 * @param {number} index - The index of the subtask in the subtasks array or task's subtasks
 */

async function editSingleSubtask(taskId, index) {
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const subtaskButtons = document.getElementById(`subtask-buttons-${index}`);

  controlSubtaskIsEditStatus();

  if (taskId == 'undefined') {
    styleEditSingleSubtask(index, inputEditSubtask);

    inputEditSubtask.value = subtasks[index].title;
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        styleEditSingleSubtask(index, inputEditSubtask);

        inputEditSubtask.value = element.data.subtasks[index].title;
      }
    }
  }
  subtaskButtons.style.visibility = 'visible';
}

/**
 * Checks if isSubtaskEdiOn is true and else sets it to true
 * 
 * @returns null
 */
function controlSubtaskIsEditStatus() {
  if (isSubtaskEditOn) {
    return;
  } else {
    isSubtaskEditOn = true;
  }
}

/**
 * Sets the different styles on Subtasks
 * 
 * @param {number} index - index number
 * @param {element} inputEditSubtask - input element
 */
function styleEditSingleSubtask(index, inputEditSubtask) {
  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );

  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);

  singleSubtaskTitle.style.display = 'none';
  inputEditSubtask.style.display = 'flex';
  editSubtaskBtn.style.display = 'none';
  submitEditSubtaskBtn.style.display = 'flex';
  subtask.style.borderBottom = '1px solid #29abe2';

  if (isSubtaskEditOn) {
    let subtaskElement = document.getElementById(`subtask-${index}`);
    subtaskElement.classList.remove('subtasks-hover');
  }
}

/**
 * Submits the edited title of a single subtask. Updates the title in either
 * the local subtasks array or the specified task's subtasks, and reflects
 * the changes in the UI
 *
 * @param {string} taskId - The ID of the task to which the subtask belongs
 *                          If 'undefined', the function uses the local subtasks array directly
 * @param {number} index - The index of the subtask in the subtasks array or task's subtasks
 */

async function submitEditedSingleSubtask(taskId, index) {
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const subtaskButtons = document.getElementById(`subtask-buttons-${index}`);

  if (taskId == 'undefined') {
    subtasks[index].title = inputEditSubtask.value;

    styleSubmitEditedSingleSubtask(index, inputEditSubtask);
    renderSubtasksList();
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        styleSubmitEditedSingleSubtask(index, inputEditSubtask);

        element.data.subtasks[index].title = inputEditSubtask.value;

        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList();
      }
    }
  }
  subtaskButtons.style.visibility = 'hidden';
  isSubtaskEditOn = false;
}

/**
 * Displays the element with the entered input and hides the input fields
 * 
 * @param {number} index - index number
 * @param {element} inputEditSubtask - Input element path
 */
function styleSubmitEditedSingleSubtask(index, inputEditSubtask) {
  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );

  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);

  singleSubtaskTitle.style.display = 'flex';
  inputEditSubtask.style.display = 'none';
  editSubtaskBtn.style.display = 'flex';
  submitEditSubtaskBtn.style.display = 'none';
  subtask.style.borderBottom = 'none';
}

/**
 * Deletes a single subtask from either the local subtasks array or a specific task's subtasks array
 * The function updates the relevant array and renders the updated list in the UI
 *
 * @param {string} taskId - The ID of the task from which the subtask will be deleted
 *                          If 'undefined', the function deletes the subtask from the local subtasks array
 * @param {number} index - The index of the subtask to be deleted in the subtasks array
 */
async function deleteSingleSubtask(taskId, index) {
  if (taskId == 'undefined') {
    subtasks.splice(index, 1);
    renderSubtasksList();
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        element.data.subtasks.splice(index, 1);
        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList();
      }
    }
  }
}

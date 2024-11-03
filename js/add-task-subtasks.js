// SUBTASKS

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

function cancelInputSubtask() {
  if (isEditOn) {
    editInputSubtask.value = '';
  } else {
    inputSubtask.value = '';
  }

  controlSubtaskIcons();
}

function submitInputSubtask() {
  const subtaskObj = {
    title: isEditOn ? editInputSubtask.value : inputSubtask.value,
    checked: false,
  };

  subtasks.push(subtaskObj);

  if (!isEditOn) {
    console.log('clear inputSubtask', isEditOn);
    inputSubtask.value = '';
  } else {
    console.log('clear editInputSubtask', isEditOn);
    editInputSubtask.value = '';
  }

  controlSubtaskIcons();
  renderSubtasksList();
}

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

// FIXME:
async function editSingleSubtask(taskId, index) {
  if (isSubtaskEditOn) {
    return;
  } else {
    isSubtaskEditOn = true;
  }

  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);
  const subtaskButtons = document.getElementById(`subtask-buttons-${index}`);

  if (taskId == 'undefined') {
    singleSubtaskTitle.style.display = 'none';
    inputEditSubtask.style.display = 'flex';
    editSubtaskBtn.style.display = 'none';
    submitEditSubtaskBtn.style.display = 'flex';
    subtask.style.borderBottom = '1px solid #29abe2';

    if (isSubtaskEditOn) {
      let subtaskElement = document.getElementById(`subtask-${index}`);
      subtaskElement.classList.remove('subtasks-hover');
    }
    inputEditSubtask.value = subtasks[index].title;
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        singleSubtaskTitle.style.display = 'none';
        inputEditSubtask.style.display = 'flex';
        editSubtaskBtn.style.display = 'none';
        submitEditSubtaskBtn.style.display = 'flex';
        subtask.style.borderBottom = '1px solid #29abe2';

        if (isSubtaskEditOn) {
          let subtaskElement = document.getElementById(`subtask-${index}`);
          subtaskElement.classList.remove('subtasks-hover');
        }
        inputEditSubtask.value = element.data.subtasks[index].title;
        // await updateTaskInFirebase(element.id, element.data);
      }
    }
  }
  subtaskButtons.style.visibility = 'visible';
}

// FIXME:
async function submitEditedSingleSubtask(taskId, index) {
  const singleSubtaskTitle = document.getElementById(
    `single-subtask-title-${index}`
  );
  const inputEditSubtask = document.getElementById(
    `input-edit-subtask-${index}`
  );
  const editSubtaskBtn = document.getElementById(`edit-subtask-${index}`);
  const submitEditSubtaskBtn = document.getElementById(
    `submit-edit-subtask-${index}`
  );
  const subtask = document.getElementById(`subtask-${index}`);
  const subtaskButtons = document.getElementById(`subtask-buttons-${index}`);

  if (taskId == 'undefined') {
    subtasks[index].title = inputEditSubtask.value;

    singleSubtaskTitle.style.display = 'flex';
    inputEditSubtask.style.display = 'none';
    editSubtaskBtn.style.display = 'flex';
    submitEditSubtaskBtn.style.display = 'none';
    subtask.style.borderBottom = 'none';

    renderSubtasksList();
  } else {
    for (let element of tasks) {
      if (element.id == taskId) {
        singleSubtaskTitle.style.display = 'flex';
        inputEditSubtask.style.display = 'none';
        editSubtaskBtn.style.display = 'flex';
        submitEditSubtaskBtn.style.display = 'none';
        subtask.style.borderBottom = 'none';

        element.data.subtasks[index].title = inputEditSubtask.value;

        await updateTaskInFirebase(element.id, element.data);
        renderSubtasksList();
      }
    }
  }
  subtaskButtons.style.visibility = 'hidden';
  isSubtaskEditOn = false;
}

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

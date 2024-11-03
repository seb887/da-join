function createSubtasksListHTML(index, id) {
  return `
    <li id="subtask-${index}" class="subtasks subtasks-hover">
      <div id="single-subtask-title-${index}" class="subtask-title">${subtasks[index].title}</div>
        <input id="input-edit-subtask-${index}" class="input-edit-subtask" type="text"/>
        <div id="subtask-buttons-${index}" class="subtask-buttons">
        <img
        src="../assets/icons/edit-subtask.png"
        alt="edit icon"
        id="edit-subtask-${index}"
        class="edit-subtask"
        onclick="editSingleSubtask('${id}', '${index}')"
        />
        <img
        src="../assets/icons/submit-subtask.png"
        alt="submit icon"
        id="submit-edit-subtask-${index}"
        class="submit-edit-subtask"
        onclick="submitEditedSingleSubtask('${id}', '${index}')"
        />
        <img
        src="../assets/icons/delete-subtask.png"
        alt="trash icon"
        id="delete-subtask-${index}"
        class="delete-subtask"
        onclick="deleteSingleSubtask('${id}', '${index}')"
        />
      </div>
    </li>
    `;
}

function assignedToContactsContent(contact, id, index) {
  return `
    <label for ="${contact['id']}cb">
        <div class ="add-task-contact-list">
          <div>
            <div id= "${contact['id']}-container" class= "initial-div">${contact['initials']}</div>
            <div>${contact['name']}</div>
          </div>
          <input onchange ="inspectCheckboxes('assigned-contacts-list')" value="${contact['id']}cb" id="${contact['id']}cb" type ="checkbox">
        </div>
    </label>
      `;
}

function assignedInitialContent(match, index) {
  return `
    <div id="addContactList${index}" class ="assigned-contacts-initial-container">
        <div>
          <div style="background-color:${match['color']}" id= "${match['id']}-container" class= "initial-div">${match['initials']}</div>
        </div>
    </div>
  `;
}

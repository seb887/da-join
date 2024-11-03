/**
 * Generates the HTML for a subtask list item
 *
 * @param {number} index - The index of the subtask in the list
 * @param {string} id - The unique identifier for the parent task or subtask
 */
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

/**
 * Generates the HTML content for displaying a contact in the "Assigned To" contacts list with a checkbox
 *
 * @param {Object} contact - The contact object containing information about the contact
 * @param {string} id - The unique ID of the parent element
 * @param {number} index - The index of the contact in the list
 */
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

/**
 * Generates the HTML content for displaying a contact's initials in the assigned contacts list
 *
 * @param {Object} match - The contact object containing information about the contact
 * @param {number} index - The index of the contact in the list
 */
function assignedInitialContent(match, index) {
  return `
    <div id="addContactList${index}" class ="assigned-contacts-initial-container">
        <div>
          <div style="background-color:${match['color']}" id= "${match['id']}-container" class= "initial-div">${match['initials']}</div>
        </div>
    </div>
  `;
}

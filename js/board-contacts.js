/**
 * Converts the fetch response into an object and returns it
 * 
 * @returns Returns an array of all tasks
 */
async function returnTasksFromFirebase() {
  let response = await fetch(BASE_URL + 'tasks' + '.json');
  let tasks = await response.json();
  let taskAsObject = Object.values(tasks);
  let taskKeys = Object.keys(tasks);
  taskAsObject.forEach((task, index) => {
    task.id = taskKeys[index];
  });
  return taskAsObject;
}

/**
 * Creates an HTML element for each contact with their initials and specific background color.
 * 
 * @param {string} taskId text - Identifier of a single task
 * @param {Object} task - single task object
 * @param {string} path - path of the HTML- element
 * @returns null
 */

async function renderAssignedToInCard(taskId, task, path = '') {
  let card = document.getElementById(path + taskId);
  card.innerHTML = '';
  if (task.data.assignedTo == undefined) {
    return;
  } else {
    task.data.assignedTo.forEach((assignedContact, index) => {
      if (index < 4) {
        card.innerHTML += `
        <div style="background-color:${assignedContact.color}" id="${
          assignedContact.id + '-cpb'
        }" class="card-profile-badge-3">${assignedContact.initials}</div>
        `;
      } else if (index == 4) {
        card.innerHTML += `
        <div style="background-color:#2A3647; text-align: center;" id="${
          assignedContact.id + '-cpb'
        }" class="card-profile-badge-3">+${
          task.data.assignedTo.length - 4
        }</div>
        `;
      }
    });
  }
}


/**
 * Creates and returns an Array of all assigned contacts from all created tasks
 * 
 * @returns array
 */
async function getAllAssignedTo() {
  let tasks = await returnTasksFromFirebase();
  let assignTo = [];
  tasks.forEach((task) => {
    if (task['assignedTo']) {
      assignTo.push(task['assignedTo']);
    }
  });
  return assignTo;
}


/**
 * Creates an HTML element for each contact with their initials, name, and a background color
 * 
 * @param {string} id - Identifier for the single task
 */
async function displayTaskModalContacts(id) {
  let container = document.getElementById('task-modal-assigned-contacts');
  let assignedTo = document.getElementById('task-modal-card-assigned-to');

  container.innerHTML = '';
  tasks.forEach((task) => {
    if (task.id == id) {
      // if (task.data.assignedTo && task.id == id) {

      if (task.data.assignedTo == undefined) {
        assignedTo.style.display = 'none';
      } else {
        assignedTo.style.display = 'flex';

        task.data.assignedTo.forEach((assignedContact) => {
          container.innerHTML += `
          <div class= "task-modal-assigned-contacts-container">
            <div style="background-color:${assignedContact.color}"class="task-modal-contact-profile-img">${assignedContact.initials}</div>
            <div class="task-modal-contact-name">${assignedContact.name}</div>
          </div> `;
        });
      }

      // } else if (task.data.assignedTo == undefined) {
      //   let assignedTo = document.getElementById('task-modal-card-assigned-to');

      //   assignedTo.style.display = 'none';
    }
  });
}


/**
 * toggles the visibility of the assigned contacts list
 * 
 */
function dropDownContactsEditTask() {
  const contactList = document.getElementById('assigned-contacts-list');
  const container = document.getElementById('task-modal-card');
  container.addEventListener('click', (e) => {});
  if (contactList.style.display == 'flex') {
    closeDropdownMenu(contactList);
  } else {
    openDropdownMenu(contactList);
  }
}


/**
 * sets the display to none, sets the placeholder text and switches the source of the arrow picture
 * 
 * @param {element} contactList - the html path of the contact list
 */
function closeDropdownMenu(contactList) {
  contactList.style.display = 'none';
  if (sContactBoard) {
    sContactBoard.placeholder = 'Select contacts to assign';
    sContactBoardAddTask.placeholder = 'Select contacts to assign';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-down.png';
    document.getElementById('arrowAssignToAddTask').src =
      '../assets/icons/arrow-down.png';
  } else if (sContactAdd) {
    sContactAdd.placeholder = 'Select contacts to assign';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-down.png';
  }
}


/**
 * sets the display to flex, deletes the placeholder text and switches the source of the arrow picture
 * 
 * @param {element} contactList - the html path of the contact list
 */
function openDropdownMenu(contactList) {
  contactList.style.display = 'flex';
  if (sContactAdd) {
    sContactAdd.placeholder = '';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-up.png';
  } else if (sContactBoard) {
    sContactBoard.placeholder = '';
    sContactBoardAddTask.placeholder = '';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-up.png';
    document.getElementById('arrowAssignToAddTask').src =
      '../assets/icons/arrow-up.png';
  }
}

function checkIfAnimationActiveBoard() {
  let modal = document.getElementById('addContact');
  if (animationActive) {
    modal.classList.remove('animation-slide-in');
    modal.classList.add('animation-slide-out');
    setTimeout(() => {
      modal.style.display = 'none';
      document.getElementById('modalBackground').style.display = 'none';
    }, 250);
  } else {
    modal.classList.remove('animation-slide-out');
    modal.classList.add('animation-slide-in');
    document.getElementById('modalBackground').classList.add('change-opacity');
  }
}

function modalSlideInOrOut(modalId) {
  if (!modalActive) {
    document.getElementById(modalId).classList.add('task-modal-slide-in');
    document.getElementById(modalId).classList.remove('task-modal-slide-out');
    document.body.style.overflow = 'hidden';
  } else {
    document.getElementById(modalId).classList.remove('task-modal-slide-in');
    document.getElementById(modalId).classList.add('task-modal-slide-out');
    document.body.style.overflow = 'unset';
  }
  modalActive = !modalActive;
  setTimeout(() => {
    document.getElementById(modalId).classList.remove('task-modal-slide-in');
    document.getElementById(modalId).classList.remove('task-modal-slide-out');
  }, 350);
}

function selectAllAssignedContacts(taskId) {
  document.getElementById('assigned-contacts-list').innerHTML = '';
  tasks.forEach((task) => {
    if (task.data.assignedTo && task.id == taskId) {
      task.data.assignedTo.forEach((contact) => {
        document.getElementById(contact.id + 'cb')
          ? (document.getElementById(contact.id + 'cb').checked = true)
          : null;
        inspectCheckboxes('assigned-contacts-list');
      });
    }
  });
}

window.onscroll = function (ev) {
  const scrollPosition = window.innerHeight + Math.round(window.scrollY);
  const totalHeight = document.documentElement.scrollHeight;
  if (scrollPosition >= totalHeight) {
    document.getElementById('footer').classList.add('footer-animation');
  } else {
    document.getElementById('footer').classList.remove('footer-animation');
  }
};


/**
 * fetches and pushes all created contacts to the renderedContacts array
 * 
 */
async function listContactsToAssignedToinBoard() {
  let allContacts = Object.values(await getContacts());
  let id = Object.keys(await getContacts());
  renderedContacts = [];
  allContacts.forEach((contact, index) => {
    contact.id = id[index];
  });
  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  contactContainer.innerHTML = '';
  allContacts.forEach((contact, index) => {
    contactContainer.innerHTML += assignedToContactsContent(contact);
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
    renderedContacts.push(contact);
  });
}


/**
 * creates HTML- elements for each renders contact to the input assigned to addTtask div container
 * 
 */
function renderContactsinAddTask() {
  let list = document.getElementById('input-assigned-to-addTask');
  renderedContacts.forEach((contact) => {
    list.innerHTML += assignedToContactsContent(contact);
  });
}


/**
 * creates one object with all assigned contacts from all tasks and all rendered contacts
 * 
 * @returns object
 */
async function createCompareArray() {
  let taskArray = [];
  tasks.forEach((task, index) => {
    if (task.data.assignedTo) {
      task.data.assignedTo.forEach((element) => {
        renderedContacts.forEach((contact) => {
          if (contact.id == element.id) {
            let arr = [
              {
                pattern: contact,
                example: element,
                taskId: task.id,
              },
            ];
            taskArray.push(arr);
          } else {
            return;
          }
        });
      });
    }
  });
  return taskArray;
}

async function deleteNonExistingContactsInTask() {
  // 1. Compare each ID of renderedContacts (which are all current existing contacts) with all assignedTo Contacts in Tasks
  // 2. If an ID in a Task doesent match one of the renderedContacts it should get deleted out of the Task.
  const getAllAssignedContacts = await getAllAssignedTo();

  const renderedContactIds = renderedContacts.map((contact) => contact.id);

  const result = getAllAssignedContacts.filter(
    (assignedContact) => !renderedContactIds.includes(assignedContact.id)
  );

  console.log(result);
}


/**
 * compares the object entries 'example & pattern' then creates an array with that dont match the pattern
 * 
 * @returns array
 */
async function compareArray() {
  let comparsion = await createCompareArray();
  let assignedContactsToUpdate = [];
  comparsion.forEach((element) => {
    let example = element[0]['example'];
    let pattern = element[0]['pattern'];
    example['name'] !== pattern['name']
      ? assignedContactsToUpdate.push({
          taskId: element[0]['taskId'],
          contactId: pattern['id'],
        })
      : null;
    example['email'] !== pattern['email']
      ? assignedContactsToUpdate.push({
          taskId: element[0]['taskId'],
          contactId: pattern['id'],
        })
      : null;
    example['initials'] !== pattern['initials']
      ? assignedContactsToUpdate.push({
          taskId: element[0]['taskId'],
          contactId: pattern['id'],
        })
      : null;
    example['phone'] !== pattern['phone']
      ? assignedContactsToUpdate.push({
          taskId: element[0]['taskId'],
          contactId: pattern['id'],
        })
      : null;
  });
  return assignedContactsToUpdate;
}


/**
 * returns the index of matching renderd contact id 
 * 
 * @param {string} contactId - identifier for the contact
 * @returns number 
 */
async function findMatchInRenderedContacts(contactId) {
  let indexOfRenderedContact = '';
  renderedContacts.forEach((contact, index) => {
    let match = contact.id.match(contactId);
    if (match != null) {
      indexOfRenderedContact = index;
    }
  });
  return indexOfRenderedContact;
}


/**
 * returns the index of matching contact id in tasks
 * 
 * @param {string} taskId - indetifier of single task
 * @param {string} contactId - identifier for the contact
 * @returns number
 */
async function findIndexInTaskAssignedTo(taskId, contactId) {
  let indexInAssignedTo = '';
  tasks.forEach((task) => {
    if (taskId == task.id) {
      task.data.assignedTo.forEach((contact, index) => {
        if (contact.id == contactId) {
          indexInAssignedTo = index;
        }
      });
    }
  });
  return indexInAssignedTo;
}


/**
 * updates the compared assigned contacts in all tasks with the data of current contacts
 * 
 * @param {*} contactId - identifier for the contact
 * @param {*} taskId - identifier for the task
 * @returns null
 */
async function updateComparedTasks(contactId, taskId) {
  let assignedContactsToUpdate = await compareArray();
  if (assignedContactsToUpdate.length > 0) {
    console.log('Tasks updated.');
    assignedContactsToUpdate.forEach(async (contact, index) => {
      let contactToPut =
        renderedContacts[await findMatchInRenderedContacts(contact.contactId)];
      let fetchURL =
        BASE_URL +
        'tasks/' +
        contact.taskId +
        '/assignedTo/' +
        (await findIndexInTaskAssignedTo(contact.taskId, contact.contactId)) +
        '.json';
      await fetch(fetchURL, {
        method: 'PUT',
        body: JSON.stringify(contactToPut),
      });
    });
    await renderBoard();
  } else {
    return;
  }
}


/**
 * creates HTML-content for all existing contacts into the assigned contacts list div
 * 
 */
function renderAllContactsInAddTask() {
  let inputChild = document.querySelector(
    '#input-assigned-to-addTask > label:nth-child(1)'
  );
  inputAssignedTo.innerHTML = '';
  document.getElementById('assigned-contacts-list').innerHTML = '';
  inputATAT.innerHTML = '';
  renderedContacts.forEach((contact) => {
    inputATAT.innerHTML += assignedToContactsContentAddTask(contact);
    setBackgroundColor(contact);
  });
}


/**
 * inspects all checkboxes and creates an HTML-element with contact initials and specific background color for each checked checkbox
 * 
 * @param {*} path 
 */
function inspectCheckboxesAddTask(path) {
  let allDivs = document.getElementById('input-assigned-to-addTask');
  assignedContacts = [];
  allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
    if (cb.checked) {
      assignedContacts.push(cb.value);
      cb.parentElement.parentElement.classList.add('selected');
      renderAssignedContacts('assigned-contacts-list-addTask');
    }
    if (!cb.checked) {
      cb.parentElement.parentElement.classList.remove('selected');
      renderAssignedContacts('assigned-contacts-list-addTask');
    }
  });
}

/**
 * removes all elements from assigned contact list and clears the inputlist
 */
function removeAssignedList() {
  inputAssignedTo.innerHTML = '';
  document.getElementById('assigned-contacts-list').innerHTML = '';
  inputATAT.innerHTML = '';
}


/**
 * displayes or hides the contactlist on input or clear inputfield
 * 
 * @param {string} path - path for the HTML - element
 * @returns boolean
 */
function showOrHideContactsOnInputInBoard(path) {
  let arrow = document.getElementById('arrowAssignTo');
  let arrowAddTask = document.getElementById('arrowAssignToAddTask');
  let allDivs = document.getElementById(path);
  const contactList = document.getElementById(path);
  if (input1.value.length > 0 || input2.value.length > 0) {
    contactList.style.display = 'flex';
    arrow.src = '../assets/icons/arrow-up.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = 'none';
    });
    return true;
  } else {
    document.getElementById(path).style.display = 'none';
    arrow.src = '../assets/icons/arrow-down.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = '';
    });
    return false;
  }
}


/**
 * compares input with contactname and displays matching contact
 */
function displayMatchingContactsInBoard() {
  renderedContacts.forEach((contact) => {
    if (
      contact.name.toLowerCase().slice(0, 2) ==
      input1.value.toLowerCase().slice(0, 2)
    ) {
      document.getElementById(
        `${contact.id}cb`
      ).parentElement.parentElement.style.display = '';
    } else if (
      contact.name.toLowerCase().slice(0, 2) ==
      input2.value.toLowerCase().slice(0, 2)
    ) {
      document.getElementById(
        `${contact.id}cb`
      ).parentElement.parentElement.style.display = '';
    }
  });
}


/**
 * executes displayMatchingContactsInBoard if showOrHideContactsOnInputInBoard is true
 * 
 * @param {string} path - path for HTML- element 
 */
function filterContactsInBoard(path) {
  if (showOrHideContactsOnInputInBoard(path)) {
    displayMatchingContactsInBoard(path);
  }
}


/**
 * clears the contactlist and inputs in add task and hides the dropdownlist of contacts
 */
function clearAssignedContacts() {
  document.getElementById('assigned-contacts-list-addTask').innerHTML = '';
  input1 ? (input1.value = '') : null;
  input2 ? (input2.value = '') : null;
  if ((inputATAT.style.display = 'flex')) {
    dropDownContacts('searchContact-board-addTask', 1);
  }
}


/**
 * HTML- content for a single assigned contact
 * 
 * @param {element} contact - element of the single contact
 * @param {string} id - identifier for the contact
 * @param {string} index - number as string
 * @returns null
 */
function assignedToContactsContentAddTask(contact, id, index) {
  return `
  <label for ="${contact['id']}cb">
      <div class ="add-task-contact-list">
        <div>
          <div id= "${contact['id']}-container" class= "initial-div">${contact['initials']}</div>
          <div>${contact['name']}</div>
        </div>
        <input onchange ="inspectCheckboxesAddTask('assigned-contacts-list-addTask')" value="${contact['id']}cb" id="${contact['id']}cb" type ="checkbox">
      </div>
  </label>
    `;    
}

function selectAllAssignedContacts(taskId) {
  document.getElementById('assigned-contacts-list').innerHTML = '';
  tasks.forEach((task) => {
    if (task.data.assignedTo && task.id == taskId) {
      task.data.assignedTo.forEach((contact) => {
        document.getElementById(contact.id + 'cb')
          ? (document.getElementById(contact.id + 'cb').checked = true)
          : null;
        inspectCheckboxes('assigned-contacts-list');
      });
    }
  });
}


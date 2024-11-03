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

function renderContactsinAddTask() {
  let list = document.getElementById('input-assigned-to-addTask');
  renderedContacts.forEach((contact) => {
    list.innerHTML += assignedToContactsContent(contact);
  });
}

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
} // greift auf input-assigned-to zu nicht auf input-assigned-to-addTask

function removeAssignedList() {
  inputAssignedTo.innerHTML = '';
  document.getElementById('assigned-contacts-list').innerHTML = '';
  inputATAT.innerHTML = '';
}

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

function filterContactsInBoard(path) {
  if (showOrHideContactsOnInputInBoard(path)) {
    displayMatchingContactsInBoard(path);
  }
}

function clearAssignedContacts() {
  document.getElementById('assigned-contacts-list-addTask').innerHTML = '';
  input1 ? (input1.value = '') : null;
  input2 ? (input2.value = '') : null;
  if ((inputATAT.style.display = 'flex')) {
    dropDownContacts('searchContact-board-addTask', 1);
  }
}

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

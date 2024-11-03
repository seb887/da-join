async function getContacts() {
  let response = await fetch(CONTACT_URL);
  let contacts = await response.json();
  return contacts;
}

async function listContactsToAssignedTo() {
  let allContacts = Object.values(await getContacts());
  let id = Object.keys(await getContacts());
  renderedContacts = [];
  allContacts.forEach((contact, index) => {
    contact.id = id[index];
  });
  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  inputAssignedTo.innerHTML = '';
  allContacts.forEach((contact, index) => {
    inputAssignedTo.innerHTML += assignedToContactsContent(contact);
    setBackgroundColor(contact);
    renderedContacts.push(contact);
  });
}

function setBackgroundColor(contact) {
  if (document.getElementById(contact['id'] + '-container')) {
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
  }
}

function inspectCheckboxes(path) {
  let allDivs = document.getElementById('input-assigned-to');
  assignedContacts = [];
  allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
    if (cb.checked) {
      assignedContacts.push(cb.value);
      cb.parentElement.parentElement.classList.add('selected');
      renderAssignedContacts(path);
    }
    if (!cb.checked) {
      cb.parentElement.parentElement.classList.remove('selected');
      renderAssignedContacts(path);
    }
  });
}

function dropDownContacts(containerId, addTask) {
  let modal = document.getElementById(containerId);
  if (addTask) {
    inputAssignedTo = document.getElementById('input-assigned-to-addTask');
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      closeDropdownMenu(inputAssignedTo);
    });
  }
  if (inputAssignedTo.style.display == 'flex') {
    closeDropdownMenu(inputAssignedTo);
  } else {
    openDropdownMenu(inputAssignedTo);
  }
  inputAssignedTo = document.getElementById('input-assigned-to');
}

function filterContacts(event) {
  if (showOrHideContactsOnInput()) {
    displayMatchingContacts();
  }
}

function showOrHideContactsOnInput() {
  let allDivs = document.getElementById('input-assigned-to');
  const contactList = document.getElementById('input-assigned-to');
  if (document.getElementById('searchContact').value.length > 0) {
    contactList.style.display = 'flex';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-up.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = 'none';
    });
    return true;
  } else {
    document.getElementById('input-assigned-to').style.display = 'none';
    document.getElementById('arrowAssignTo').src =
      '../assets/icons/arrow-down.png';
    allDivs.querySelectorAll('input[type = "checkbox"]').forEach((cb) => {
      cb.parentElement.parentElement.style.display = '';
    });
    return false;
  }
}

function displayMatchingContacts() {
  let input = document.getElementById('searchContact');
  renderedContacts.forEach((contact) => {
    if (
      contact.name.toLowerCase().slice(0, 2) ==
      input.value.toLowerCase().slice(0, 2)
    )
      document.getElementById(
        `${contact.id}cb`
      ).parentElement.parentElement.style.display = '';
  });
}

function renderAssignedContacts(path) {
  let container = document.getElementById(path);
  container.innerHTML = '';
  matches = [];
  matches = renderedContacts.filter((contact) =>
    assignedContacts.some((id) => id.slice(0, -2) === contact.id)
  );
  matches.forEach((match, index) => {
    container.innerHTML += assignedInitialContent(match, index);
  });
}

function renderContactArray() {
  inputAssignedTo.innerHTML = '';
  renderedContacts.forEach((contact, index) => {
    inputAssignedTo.innerHTML += assignedToContactsContentFilter(
      contact,
      contact['id']
    );
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
  });
}

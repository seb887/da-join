/**
 * Fetches contact data from a specified URL
 */
async function getContacts() {
  let response = await fetch(CONTACT_URL);
  let contacts = await response.json();
  return contacts;
}

/**
 * Sorts, and displays contact data, setting contact IDs and background colors
 */
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
  closeDropdownOnclick()
}


function closeDropdownOnclick(){
  const searchContactDiv = document.getElementById('searchContact');
  document.addEventListener('click', (event) => {
    if (searchContactDiv && !searchContactDiv.contains(event.target)) {
        if(document.getElementById('input-assigned-to').style.display == "flex"){
            dropDownContacts('searchContact');
        }
    }
});
}

/**
 * Sets the background color of a contact's container element if it exists in the DOM
 */
function setBackgroundColor(contact) {
  if (document.getElementById(contact['id'] + '-container')) {
    document.getElementById(
      contact['id'] + '-container'
    ).style.backgroundColor = contact['color'];
  }
}

/**
 * Inspects checkboxes within a specified container, updates assigned contacts based on selections, 
 * and manages the visual state of selected contacts
 */
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

/**
 * Toggles a dropdown menu for contacts, setting the display based on the container and task context
 *
 * @param {string} containerId - The ID of the container element for the dropdown
 * @param {boolean} addTask - A flag indicating if the dropdown is part of an "Add Task" context, which affects the target input element
 */
function dropDownContacts(containerId, addTask) {
  let modal = document.getElementById(containerId);
  event.stopPropagation();
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

/**
 * Filters the list of contacts based on the input event, displaying only matching contacts
 *
 * @param {Event} event - The input event that triggers the filter operation
 */
function filterContacts(event) {
  if (showOrHideContactsOnInput()) {
    displayMatchingContacts();
  }
}

/**
 * Toggles the display of the contacts list based on the search input field's value
 * If there is input in the search field, the contact list is shown and all checkboxes are hidden
 * If the search field is empty, the contact list is hidden and checkboxes are reset to visible
 */
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

/**
 * Displays contacts whose names match the initial characters of the search input
 * Only contacts that match the first two characters of the input are shown
 */
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

/**
 * Renders the assigned contacts into the specified container based on the provided path
 * It clears the container and populates it with content for contacts that match the assigned contacts
 *
 * @param {string} path - The ID of the container where the assigned contacts will be rendered
 */
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

/**
 * Renders the contacts into the inputAssignedTo element by populating it with content for each contact
 * Clears the current content and applies background colors based on the contact's properties
 */
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

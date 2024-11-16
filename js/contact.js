CONTACT_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json';

let contactsArray = [];
let animationActive = false;



let inputContactName;
let inputEmail;
let inputPhoneNumber;
let nameError;
let emailError;
let phoneError;

/**
 * This function is active when the body loads. It sets up the user initials and renders
 * the contacts in the contact list
 */
function initContacts() {
  document
    .getElementById('goBackToList')
    .classList.add('hide-z-index-responsive');
  document
    .getElementById('contact-information-responsive')
    .classList.add('hide-info-responsive');
  renderContacts();
  setActiveUserInitials();
}

/**
 * Asynchronously fetches a list of contacts from a specified URL.
 */
async function getContacts() {
  let response = await fetch(CONTACT_URL);
  let contacts = await response.json();
  return contacts;
}

/**
 * Fetches and renders a list of contacts in the DOM, sorting them alphabetically by name
 * Each contact is assigned a unique ID and rendered within the HTML element with ID 'contacts'
 */
async function renderContacts() {
  let allContacts = Object.values(await getContacts());
  let id = Object.keys(await getContacts());
  contactsArray = [];
  allContacts.forEach((element, index) => {
    element.id = id[index];
  });
  allContacts.sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById('contacts').innerHTML = addNewContactsContent();
  allContacts.forEach((contact, index) => {
    contactsArray.push(contact);
    checkForExistingLetter(contact, index);
    document.getElementById('contacts').innerHTML += contactContent(index);
    setDataOfContact(contact, index);
  });
}

/**
 *
 * This function sets data of a contact
 *
 * @param {object} contact - This is a single object
 * @param {number} index - This is the index for each contact
 */
function setDataOfContact(contact, index) {
  document.getElementById(`initials${index}`).innerText = generateInitials(
    contact.name
  );
  document.getElementById(`contactName${index}`).innerText = contact.name;
  document.getElementById(`contactMail${index}`).textContent = contact.email;
  document.getElementById(`initialsContainer${index}`).style.backgroundColor =
    contactsArray[index].color;
}

/**
 * Checks if a header for the initial letter of a contact's name exists in the DOM.
 * If it does not exist, it adds a new header for that letter to the 'contacts' element.
 *
 * @param {Object} contact - The contact object containing at least a `name` property.
 */
function checkForExistingLetter(contact) {
  let name = contact.name.charAt(0).toUpperCase();
  let nameHeader = document.getElementById(name);
  if (!nameHeader) {
    document.getElementById('contacts').innerHTML += nameHeaderContent(name);
  }
}

/**
 * Toggles the display of a contact's detailed information in the UI, animating it with a fade and slide effect.
 * Updates the contact information and adjusts the responsive button appearance based on the selected contact.
 * @param {number } index - The index of the contact in the `contactsArray` to display
 */
function openContact(index) {
  let container = document.getElementById('contactInformation');
  let responsiveButtonBottom = document.getElementById(
    'responsive-button-bottom'
  );
  let isSameContact =
    document.getElementById('contactName').innerText ==
    contactsArray[index].name.trim();

  container.classList.toggle('contactFadeAndSlideIn', isSameContact);
  document
    .getElementById('contact-information-responsive')
    .classList.toggle('fadeAndSlideInResponsive', isSameContact);
  responsiveButtonBottom.src = '../assets/icons/more.png';
  document
    .getElementById('goBackToList')
    .classList.remove('hide-z-index-responsive');

  if (!isSameContact) {
    setTimeout(() => {
      container.classList.add('contactFadeAndSlideIn');
      document
        .getElementById('contact-information-responsive')
        .classList.add('fadeAndSlideInResponsive');
    }, 50);
  }
  setContactInformation(index);
}

/**
 * Updates the contact information display with the details of a selected contact.
 * Sets the background color, name, email, and phone number, as well as initials and
 * assigns event listeners for editing and deleting the contact
 *
 * @param {number} index - The index of the contact in the `contactsArray`
 */
async function setContactInformation(index) {
  document.getElementById('bgInitials').style.backgroundColor =
    contactsArray[index].color;
  document.getElementById('contactName').innerText = contactsArray[index].name;
  document.getElementById('mailAddress').innerText = contactsArray[index].email;
  document.getElementById('phoneNumber').innerText = contactsArray[index].phone;
  document.getElementById('initialsArticle').innerText = generateInitials(
    contactsArray[index].name
  );
  document.getElementById('delContact').onclick = () => {
    deleteContact(contactsArray[index].id);
  };
  document.getElementById('editContact').onclick = () => {
    editContact(index);
  };
  document.getElementById('edit-contact-responsive').onclick = () => {
    editContact(index);
  };
  document.getElementById('del-contact-responsive').onclick = () => {
    deleteContact(contactsArray[index].id);
  };
  setSelectedContactBackground(index);
}

/**
 * Highlights the background of the selected contact while resetting the background
 * of all other contacts. Toggles the background color and text color of the selected
 * contact to indicate selection
 *
 * @param {number} index - The index of the contact element to be highlighted in the
 * list of contacts
 */
function setSelectedContactBackground(index) {
  let allContactDivs = document.querySelectorAll('.single-contact');
  let selectedContactDiv = document.querySelectorAll('.single-contact')[index];
  if (selectedContactDiv.style.backgroundColor == 'rgb(42, 54, 71)') {
    selectedContactDiv.style.backgroundColor = 'white';
    selectedContactDiv.style.color = 'black';
    return;
  }
  allContactDivs.forEach((div) => {
    div.style.backgroundColor = 'white';
    div.style.color = 'black';
  });
  selectedContactDiv.style.backgroundColor = 'rgb(42, 54, 71)';
  selectedContactDiv.style.color = 'white';
}

/**
 * Toggles the display of the "Add Contact" modal, resetting its content and managing
 * the background display and animation state.
 */
function openAndCloseAddContact() {
  let modal = document.getElementById('addContact');
  modal.innerHTML = '';
  modal.innerHTML = addContactCardContent();
  modal.style.display = 'flex';
  document.getElementById('modalBackground').style.display = 'flex';
  checkIfAnimationActive();
  animationActive = !animationActive;
}

/**
 * Toggles the display of the edit/delete options or opens the "Add Contact" modal,
 * based on the current button icon state.
 */
function openContactOrOpenMore() {
  let responsiveButtonBottom = document.getElementById(
    'responsive-button-bottom'
  );
  let srcFilename = responsiveButtonBottom.src.split('/').pop();
  let editDelContact = document.getElementById('edit-del-contact-responsive');
  if (srcFilename === 'more.png') {
    if (editDelContact.style.display === 'flex') {
      editDelContact.style.display = 'none';
    } else {
      editDelContact.style.display = 'flex';
    }
  } else {
    openAndCloseAddContact();
  }
}

/**
 * This function checks if the animation of the modal is on
 */
function checkIfAnimationActive() {
  let modal = document.getElementById('addContact');
  if (animationActive) {
    document.body.style.overflowY = 'visible';
    modal.classList.remove('animation-slide-in');
    modal.classList.add('animation-slide-out');
    setTimeout(() => {
      modal.style.display = 'none';
      document.getElementById('modalBackground').style.display = 'none';
    }, 250);
  } else {
    modal.classList.remove('animation-slide-out');
    modal.classList.add('animation-slide-in');
    document.body.style.overflowY = 'hidden';
    document.getElementById('modalBackground').classList.add('change-opacity');
  }
}

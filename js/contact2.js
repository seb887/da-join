/**
 * Sends a POST request to create a new contact using data from input fields,
 * then highlights the new contact and shows a success message
 */
async function createContact() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const initials = generateInitials(document.getElementById('inputContactName').value);
    let response = await fetch(CONTACT_URL, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: document.getElementById('inputContactName').value,
        email: document.getElementById('inputMailAddress').value,
        phone: document.getElementById('inputPhoneNumber').value,
        color: randomColor,
        initials: initials,
      }),
    });
    selectCreatedContact(document.getElementById('inputContactName').value);
    showInfoToast('Contact succesfully created');
  }
  /**
 * Validates the contact input fields and calls the appropriate action based on the status.
 * 
 * @param {string} status - The action to perform ("add" or "edit").
 * @param {object} contact - The contact object to edit (only used in "edit" mode).
 * @param {number} index - The index of the contact being edited (only used in "edit" mode).
 * @returns {void}
 */
function checkContactInputs(status, contact, index) {
  setVariables();
  let isValid = true;

  isValid &= validateName(inputContactName, nameError);
  isValid &= validateEmailField(inputEmail, emailError);
  isValid &= validatePhoneNumber(inputPhoneNumber, phoneError);

  if (!isValid) return;

  if (status === 'add') createContact();
  if (status === 'edit') saveChangesOnContact(contact, index);
}

/**
 * Validates the name input field.
 * 
 * @param {HTMLElement} inputElement - The input field for the name.
 * @param {HTMLElement} errorElement - The element displaying error messages for the name.
 * @returns {boolean} True if the name input is valid, false otherwise.
 */
function validateName(inputElement, errorElement) {
  if (inputElement.value.trim() === '') {
    showError(inputElement, errorElement, 'Name is required');
    return false;
  }
  hideError(inputElement, errorElement);
  return true;
}

/**
 * Validates the email input field.
 * 
 * @param {HTMLElement} inputElement - The input field for the email.
 * @param {HTMLElement} errorElement - The element displaying error messages for the email.
 * @returns {boolean} True if the email input is valid, false otherwise.
 */
function validateEmailField(inputElement, errorElement) {
  if (!validateEmail(inputElement.value)) {
    showError(inputElement, errorElement, 'Invalid email address');
    return false;
  }
  hideError(inputElement, errorElement);
  return true;
}

/**
 * Validates the phone number input field.
 * 
 * @param {HTMLElement} inputElement - The input field for the phone number.
 * @param {HTMLElement} errorElement - The element displaying error messages for the phone number.
 * @returns {boolean} True if the phone number input is valid, false otherwise.
 */
function validatePhoneNumber(inputElement, errorElement) {
  if (inputElement.value.trim() === '') {
    showError(inputElement, errorElement, 'Phone number is required');
    return false;
  }
  hideError(inputElement, errorElement);
  return true;
}

/**
 * Displays an error message for an invalid input field.
 * 
 * @param {HTMLElement} inputElement - The input field to mark as invalid.
 * @param {HTMLElement} errorElement - The element to display the error message.
 * @param {string} errorMessage - The error message to display.
 */
function showError(inputElement, errorElement, errorMessage) {
  errorElement.style.visibility = 'visible';
  errorElement.innerText = errorMessage;
  inputElement.style.border = '1px solid #d22323';
}

/**
 * Hides the error message for a valid input field.
 * 
 * @param {HTMLElement} inputElement - The input field to mark as valid.
 * @param {HTMLElement} errorElement - The element to hide the error message.
 */
function hideError(inputElement, errorElement) {
  errorElement.style.visibility = 'hidden';
  errorElement.innerText = '';
  inputElement.style.border = '1px solid #d1d1d1';
}

/**
 * Validates if a string is a valid email format.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

  /**
   * Checks if the input is a correct email format and returns true or false
   * 
   * @param {string} email - Value of the input field
   * @returns boolean
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Adding the correct path for the elements
   */
  function setVariables(){
  inputContactName = document.querySelector("#inputContactName");
  inputEmail = document.querySelector("#inputMailAddress");
  inputPhoneNumber = document.querySelector("#inputPhoneNumber");
  nameError = document.getElementById('contact-name-error');
  emailError = document.getElementById('email-error');
  phoneError = document.getElementById('phone-error');
  }
  
  /**
   * Renders the contacts list, clears the input fields, selects and highlights the
   * newly created contact, and closes the "Add Contact" modal
   *
   * @param {string} contactName - The name of the newly created contact to select and highlight
   */
  async function selectCreatedContact(contactName) {
    try {
      await renderContacts();
      closeAndClear();
      const index = contactsArray.findIndex(
        (contact) => contact.name == contactName
      );
      updateAndRenderContacts(index);
      openAndCloseAddContact();
    } catch (error) {
      console.log(error);
    }
  }
  
  /**
   * Closes the "Add Contact" modal and clears the input fields for name, email, and phone number
   */
  async function closeAndClear() {
    openAndCloseAddContact();
    document.getElementById('inputContactName').value = '';
    document.getElementById('inputMailAddress').value = '';
    document.getElementById('inputPhoneNumber').value = '';
  }
  
  /**
   * Deletes a contact from the database by ID, re-renders the contact list, and displays
   * a deletion confirmation toast
   *
   * @param {string} id - The identifier of the contact to delete
   */
  async function deleteContact(id) {
    let response = await fetch(
      `https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts/${id}.json`,
      {
        method: 'DELETE',
      }
    );
    showInfoToast('Contact deleted');
    renderContacts();
    document
      .getElementById('contactInformation')
      .classList.toggle('contactFadeAndSlideIn');
    animationActive ? openAndCloseAddContact() : null;
  }
  
  /**
   * Opens the "Edit Contact" modal with the selected contact's information pre-filled,
   * allowing the user to edit the contact's details
   *
   * @param {number} index - The index of the contact in `contactsArray` to be edited
   */
  async function editContact(index) {
    let content = document.getElementById('addContact');
    let initials = generateInitials(contactsArray[index].name);
    openAndCloseAddContact();
    content.innerHTML = '';
    content.innerHTML = editContactCardContent(
      contactsArray[index],
      initials,
      index
    );
  }
  
  /**
   * Saves changes made to an existing contact by updating the contact's information
   * in the database, then refreshes the contact display and shows a confirmation toast
   *
   * @param {string} id - The identifier of the contact to update
   * @param {number} index - The index of the contact in `contactsArray` to update and re-render
   */
  async function saveChangesOnContact(id, index) {
    let initials = generateInitials(
      document.getElementById('inputContactName').value
    );
    let response = await fetch(
      `https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts/${id}.json`,
      {
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: document.getElementById('inputContactName').value,
          email: document.getElementById('inputMailAddress').value,
          phone: document.getElementById('inputPhoneNumber').value,
          color: document.getElementById('bgInitials').style.backgroundColor,
          initials: initials,
        }),
      }
    );
    updateAndRenderContacts(index);
    showInfoToast('Contact changes saved');
  }
  
  /**
   * Updates the contact display by re-rendering the contact list and
   * opening the specified contact for viewing or editing
   *
   * @param {number} index - The index of the contact in `contactsArray` to be updated and rendered
   */
  async function updateAndRenderContacts(index) {
    try {
      await renderContacts(contactsArray[index].name);
      openContact(index);
      openAndCloseAddContact();
    } catch (error) {
      console.log(error);
    }
  }
  
  /**
   * Displays a temporary toast message with the specified text,
   * which fades out after a short duration
   *
   * @param {string} text - The message to be displayed in the toast
   */
  function showInfoToast(text) {
    const toast = document.getElementById('info-toast');
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 1500);
  }
  
  /**
   * Fetches the active user's information from the database and sets their initials
   * in the specified HTML element
   */
  async function setActiveUserInitials() {
    let response = await fetch(
      'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users/activeUser.json'
    );
    let user = await response.json();
    let activeUserName = user.activeName;
    let initials = await generateInitials(activeUserName);
    document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`;
  }
  
  /**
   * Hides the current contact information display and returns the user to the contact list.
   * Updates the visibility of relevant UI elements based on the current state
   */
  function goBackToList() {
    document.getElementById('goBackToList').classList.add('hide-z-index-responsive');
    let editDelContact = document.getElementById('edit-del-contact-responsive');
    let container = document.getElementById('contactInformation');
    let responsiveButtonBottom = document.getElementById('responsive-button-bottom');
    if ((responsiveButtonBottom.src = '../assets/icons/more.png')) {
      container.classList.remove('contactFadeAndSlideIn');
      document.getElementById('contact-information-responsive').classList.remove('fadeAndSlideInResponsive');
      responsiveButtonBottom.src = '../assets/icons/add-contact.png';
      editDelContact.style.display = 'none';
    }
    setTimeout(() => {
      container.classList.remove('fadeAndSlideIn');
      document.getElementById('contact-information-responsive').classList.remove('contactFadeAndSlideIn');
      responsiveButtonBottom.src = '../assets/icons/add-contact.png';
      editDelContact.style.display = 'none';
    }, 50);
  }
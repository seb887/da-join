/**
 * Generates the HTML content for a single contact entry, including initials,
 * name, and email link, which can be clicked to open the contact details
 *
 * @param {number} index - The index of the contact in the list, used for
 *                         generating element IDs
 */
function contactContent(index) {
  return `
        <div onclick ="openContact('${index}')" class="single-contact">
        <div id="initialsContainer${index}" class="initials-container">
            <span id="initials${index}"></span>
          </div>
          <div class="contact-data">
            <h4 id="contactName${index}"></h4>
            <a href="#" id="contactMail${index}"></a>
          </div>
        </div>
    `;
}

/**
 * Generates the HTML content for a header section that displays a letter
 * and includes a separator line below it
 *
 * @param {string} letter - The letter to be displayed as the header
 */
function nameHeaderContent(letter) {
  return `
        <div class="nameHeader" id ="${letter}">
            <h3>${letter}</h3>
        </div>
        <div class="seperator">
            <div class="line">
            </div>
        </div>
    `;
}

/**
 * Generates the HTML content for a section that allows users to add new contacts,
 * including a button that triggers the "Add Contact" modal
 */
function addNewContactsContent() {
  return `
        <div class="add-new-contacts">
            <button onclick="openAndCloseAddContact()">Add new contact<img src="../assets/icons/person_add.png"></img></button>
        </div>
    `;
}

/**
 * Generates the HTML content for the "Add Contact" modal, including the header,
 * input fields for contact details, and buttons for submitting or canceling the action
 */
function addContactCardContent() {
  return `
        <div class="modal-header-logo-left">
          <div class="logo-modal">
            <img src="../assets/img/logo-white.png" alt="logo-white">
          </div>
          <div class="header-modal">
            <h1>Add Contact</h1>
            <h2>Tasks are better with a team!</h2>
            <div class="header-seperator"></div>
          </div>
        </div>
        <div class="add-contact-modal-right">
          <div class="add-contact-modal-person">
            <img src="../assets/icons/add-contact-person.png" alt="profile-add-contact">
          </div>
          <div class="input-field-right">
              <div id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></div>
              <form novalidate onsubmit="event.preventDefault();checkContactInputs('add')" class="input-fields" action="">
                  <input onchange ="checkContactInputs('add')" placeholder="Name" id="inputContactName" type="text" type="text" minlength="3" maxlength="24">
                  <span style ="visibility:hidden" class= "error" id="contact-name-error">Please enter a name</span>
                  <input onchange ="checkContactInputs('add')" placeholder="Email" id="inputMailAddress"  minlength="3" maxlength="32" type="text">
                  <span style ="visibility:hidden" class= "error" id="email-error">Check your email. Please try again.</span>
                  <input onchange ="checkContactInputs('add')" placeholder="Phone" id="inputPhoneNumber" type="number" minlength="6">
                  <span style ="visibility:hidden" class= "error" id="phone-error">Please enter a phone number</span>
                <div class="add-contact-button-bottom">
                  <button type="button" onclick="openAndCloseAddContact()">Cancel</button>
                  <button type="submit">Create contact</button>
                </div>
              </form>
          </div>
        </div>
    `;
}

/**
 * Generates the HTML content for the "Edit Contact" modal, including the current contact's
 * information pre-filled in the input fields, initials, and buttons for saving changes or deleting the contact
 *
 * @param {Object} contact - The contact object containing the details to be edited
 * @param {string} initials - The initials of the contact to display in the modal
 * @param {number} index - The index of the contact in the contacts array, used for identifying the contact during updates
 */
function editContactCardContent(contact, initials, index) {
  return `
        <div class="modal-header-logo-left">
          <div class="logo-modal">
            <img src="../assets/img/logo-white.png" alt="logo-white">
          </div>
          <div class="header-modal">
            <h1>Edit Contact</h1>
            <h2></h2>
            <div class="header-seperator"></div>
          </div>
        </div>
        <div class="add-contact-modal-right">
          <div id="bgInitials" class="initials-container-edit" style="background-color: ${contact.color};">
          <span id="initialsArticle">${initials}</span>
        </div>
          <div class="input-field-right">
              <div id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></div>
              <form novalidate onsubmit="event.preventDefault();checkContactInputs('edit', '${contact.id}','${index}')" class="input-fields" action="">
                  <input onchange="checkContactInputs('edit', '${contact.id}','${index}')" placeholder="Name" value = "${contact.name}" id="inputContactName" type="text" minlength="3" maxlength="24">
                  <span style ="visibility:hidden" class= "error" id="contact-name-error">Please enter a name</span>
                  <input onchange ="checkContactInputs('edit', '${contact.id}','${index}')" placeholder="Email" value = "${contact.email}" id="inputMailAddress" type="text" minlength="3" maxlength="32">
                  <span style ="visibility:hidden" class= "error" id="email-error">Check your email. Please try again.</span>
                  <input onchange ="checkContactInputs('edit', '${contact.id}','${index}')" placeholder="Phone" value = "${contact.phone}" id="inputPhoneNumber" type="number" minlength="6">
                  <span style ="visibility:hidden" class= "error" id="phone-error">Please enter a phone number</span>
                <div class="add-contact-button-bottom">
                  <button style="background-image: none; justify-content: center; text-align: center;" type ="button"onclick="deleteContact('${contact.id}')">Delete</button>
                  <button style="justify-content: center; width: 111px;" type="submit">Save</button>
                </div>
              </form>
          </div>
        </div>
    `;
}

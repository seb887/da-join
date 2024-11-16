
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
  
  /**
   * selects all assigned contacts from a task and sets each checkbox to checked
   *
   * @param {string} taskId - Identifier for the single task
   */
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
  
  /**
   * Closes the assigned to contact list in a single task on click outside the list
   * 
   */
  function closeDropdownOnclickBoard(){
    const searchContactDiv = document.getElementById('searchContact-board');
    const searchContactDivAddTask = document.getElementById('searchContact-board-addTask')
    document.getElementById('task-modal-edit-card').addEventListener('click', (event) => {
      if (searchContactDiv && !searchContactDiv.contains(event.target)) {
          if(document.getElementById('input-assigned-to').style.display == "flex"){
              dropDownContactsEditTask();
          }        
      }
  });
  }
  
  /**
   * Closes the assigned to contact list on the add task modal on click outside the list
   * 
   */
  function closeDropdownOnclickBoardAddTask(){
    const searchContactDiv = document.getElementById('searchContact-board-addTask');
    document.getElementById('add-task-modal-card').addEventListener('click', (event) => {
      if (searchContactDiv && !searchContactDiv.contains(event.target)) {
          if(document.getElementById('input-assigned-to-addTask').style.display == "flex"){
            dropDownContacts('searchContact-board-addTask', 1)   
          }        
      }
  });
  }
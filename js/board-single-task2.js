/**
 * Updates the details of a specified task with the current values from the edit modal
 * The task is then updated in the Firebase database, and the modal view switches back
 * to the default task modal with the updated task details
 *
 * @param {string} taskId - The ID of the task to be updated
 */
// FIXME: 22 Zeilen lang
async function editTask(taskId) {
    for (let element of tasks) {
      if (taskId == element.id) {
        if(checkForRequiredInput(editInputTitle, errorTitleEdit)){
           element.data.title = editInputTitle.value ;}else{
            return
           }
        element.data.description = editInputDescription.value;
        if(checkForRequiredInput(editInputDate, errorDateEdit)){ 
          element.data.date = editInputDate.value;}else{
          return
         }
        element.data.prio = currentPrio;
        element.data.subtasks = subtasks;
        element.data.assignedTo = getSelectedContactsEditTask();
        await updateTaskInFirebase(element.id, element.data);
        closeEditTask();
        renderBoard();
        renderAssignedContacts('assigned-contacts-list');
      }
    }
  }
  
  /**
   * Inspects the input field for entries and returns true or false
   * 
   */
  function checkForRequiredInput(inputElement, errorText){
    if(inputElement.value == ''){
      errorText.style.visibility = 'visible';
      return false 
        }else{
          errorText.style.visibility = 'hidden';
          return true
    }
  }
  
  /**
   * Determines the background color for a task category based on the specified category type
   *
   * @param {string} category - The category of the task
   */
  function setCategoryBackgroundColor(category) {
    if (category === 'User Story') {
      return '#0038FF';
    } else if (category === 'Technical Task') {
      return '#1FD7C1';
    } else if (category === 'Tutorial') {
      return '#f14e4e';
    }
  }
  
  /**
   * Retrieves a list of selected contacts for the task being edited by matching assigned contact IDs with rendered contacts
   */
  function getSelectedContactsEditTask() {
    let selectedContacts = [];
    let matchArray = renderedContacts.filter((contact) =>
      assignedContacts.some((id) => id.slice(0, -2) === contact.id)
    );
    matchArray.forEach((match, index) => {
      selectedContacts.push(match);
    });
    return selectedContacts;
  }
  
  /**
   * Closes the the edit task modal and displays the task modal 
   * 
   * @param {string} id - Identifier for the single task
   */
  function closeEditTask(id) {
    taskModal.style.display = 'none';
    taskModalEditCard.style.display = 'none';
    taskModal.style.display = 'flex';
    taskModalCard.style.display = 'flex';
    getDataForSingleTask(id);
    displayTaskModalContacts(id);
  }
  
  /**
   * This function opens the move to card modal on smaller display sizes 
   * 
   * @param {string} taskId - ID for the single task
   * @param {string} taskBoard - The actual board name 
   */
  function openMoveToCard(taskId, taskBoard) {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    taskModalMoveTo.style.display = 'flex';
    taskMoveToCard.style.display = 'flex';
  
    renderBoardSelectionList(taskId, taskBoard);
  }
  
  /**
   * This function moves the current task to the selected board and updates the firebase and renders the board.
   * 
   * @param {string} selectedBoard - Destinated board as string
   * @param {string} taskId - ID for the current task
   */
  async function closeMoveToCard(selectedBoard, taskId) {
    const body = document.querySelector('body');
    body.style.overflow = 'auto';
    taskModalMoveTo.style.display = 'none';
    taskMoveToCard.style.display = 'none';
    boardColumnSelectionList.innerHTML = '';
    for (let element of tasks) {
      if (element.id == taskId) {
        element.data.board = selectedBoard;
        await updateTaskInFirebase(element.id, element.data);
      }
    }
    renderBoard();
  }
  
  /**
   * This function creates the content for the modal
   * 
   * @param {string} taskId - ID for the current task
   * @param {string} taskBoard - The actual board name 
   */
  function renderBoardSelectionList(taskId, taskBoard) {
    const boardArr = checkCurrentBoard(taskBoard);
  
    for (let i = 0; i < boardArr.length; i++) {
      boardColumnSelectionList.innerHTML += `
        <li
          class="board-selection-item"
          onclick="closeMoveToCard('${boardArr[i]}', '${taskId}')">
          ${capitalizeFirstLetter(boardArr[i])}
        </li>
      `;
    }
  }
  
  /**
   * This function returns an array with the different board names excepted for the board the task is actual in
   * 
   * @param {string} taskBoard - The current board name as string
   * @returns - array
   */
  function checkCurrentBoard(taskBoard) {
    switch (taskBoard) {
      case 'todo':
        return ['in progress', 'await feedback', 'done'];
      case 'in progress':
        return ['todo', 'await feedback', 'done'];
      case 'await feedback':
        return ['todo', 'in progress', 'done'];
      case 'done':
        return ['todo', 'in progress', 'await feedback'];
    }
  }
function createCardHTML(element) {
  return `
      <div
        class="kanban-card" id="${element.id}"
        onclick="openTaskModal(event, '${element.id}')"
        draggable="true"
        ondragstart="drag(event)"
      >
          <div class="card-label-container">
              <div class="card-label" style="background-color: ${setCategoryBackgroundColor(
                element.data.category
              )}">${element.data.category}</div>
          </div>
          <div class="task-modal-card-title-container">
            <div class="card-title">${element.data.title}</div>
            <div class="card-description">${element.data.description}</div>
          </div>
          ${renderSubtaskProgressBar(element)}
          <div class="card-footer">
              <div id="card-footer${element.id}" class="task-collaborators">
              </div>
              <div class="task-prio">
              <img
                  src="../assets/icons/prio-${element.data.prio}.png"
                  alt="prio icon"
                  class="button-${element.data.prio}-img"
              />
              </div>
          </div>
      </div>
      `;
}

// function createTaskModalHTML(element) {
//   return `
//       <div
//         class="task-modal-card"
//         id="task-modal-card"
//         onclick="event.stopPropagation()"
//       >
//         <div class="task-modal-card-header-container">
//           <div class="task-modal-card-category" style="background-color: ${
//             element.data.bgCategory
//           }">${element.data.category}</div>
//           <img
//             src="../assets/icons/cancel.png"
//             alt="cancel icon"
//             onclick="closeTaskModal()"
//           />
//         </div>
//         <div class="task-modal-card-title">${element.data.title}</div>
//         <div class="task-modal-card-description">
//           ${element.data.description}
//         </div>
//         <div class="task-modal-card-date">
//           <div class="task-modal-card-key">Due date:</div>
//           <span class="task-modal-card-date-content">${element.data.date}</span>
//         </div>
//         <div class="task-modal-card-prio">
//           <div class="task-modal-card-key">Priority:</div>
//           <span class="task-modal-card-prio-content">${capitalizeFirstLetter(
//             element.data.prio
//           )}</span>
//           <img
//             src="../assets/icons/prio-${element.data.prio}.png"
//             alt="prio icon"
//           />
//         </div>
//         <div class="task-modal-card-assigned-to">
//           Assigned To:
//           <div class="task-modal-card-assigned-to-list">
//             <div class="task-modal-contact-container">
//               <div class="task-modal-contact-profile-img">EM</div>
//               <div class="task-modal-contact-name">Emmanuel Mauer</div>
//             </div>
//             <div class="task-modal-contact-container">
//               <div class="task-modal-contact-profile-img">MB</div>
//               <div class="task-modal-contact-name">Marcel Bauer</div>
//             </div>
//           </div>
//         </div>
//         ${checkTaskModalSubtasks(element)}
//         <div class="task-modal-card-buttons">
//           <button id="${element.id}" onclick="deleteTask(event)">
//             <img
//               src="../assets/icons/delete.png"
//               alt="delete icon"
//             />
//             Delete
//           </button>
//           <div class="task-modal-card-buttons-seperator"></div>
//           <button id="${element.id}" onclick="openEditTaskModal(event)">
//             <img
//               src="../assets/icons/edit.png"
//               alt="edit icon"
//             />
//             Edit
//           </button>
//         </div>
//       </div>
//     `;
// }

// function createEditTaskModalHTML(element) {
//   return `
//     <div
//         class="task-modal-edit-card"
//         id="task-modal-edit-card"
//         onclick="event.stopPropagation()"
//       >
//             <div class="form-container title-container">
//               <div
//                 for="title"
//                 class="add-task-labels"
//               >
//                 Title
//               </div>
//               <input
//                 type="text"
//                 class="add-task-input-title"
//                 id="input-title"
//                 name="title"
//                 value="${element.data.title}"
//               />
//             </div>
//             <div class="form-container description-container">
//               <div
//                 for="description"
//                 class="add-task-labels"
//               >
//                 Description
//               </div>
//               <textarea
//                 type="text"
//                 class="add-task-input-description"
//                 id="input-description"
//                 name="description"
//                 rows="4"
//               >${element.data.description}</textarea>
//             </div>

//             <div class="form-container date-container">
//               <div
//                 for="date"
//                 class="add-task-labels"
//               >
//                 Due date<span class="required-marker">*</span>
//               </div>
//               <input
//                 type="date"
//                 class="add-task-input-date"
//                 id="input-date"
//                 name="date"
//                 value="${element.data.date}"
//               />
//             </div>

//             <div class="form-container prio-container">
//               <div
//                 for="prio"
//                 class="add-task-labels"
//               >
//                 Prio
//               </div>
//               <div class="prio-buttons-container">
//                 <button
//                   class="prio-buttons"
//                   id="button-urgent"
//                   onclick="setPrio('urgent')"
//                 >
//                   Urgent
//                   <img
//                     src="../assets/icons/prio-urgent.png"
//                     alt="prio urgent icon"
//                     id="button-urgent-img"
//                   />
//                 </button>
//                 <button
//                   class="prio-buttons"
//                   id="button-medium"
//                   onclick="setPrio('medium')"
//                 >
//                   Medium
//                   <img
//                     src="../assets/icons/prio-medium.png"
//                     alt="prio medium icon"
//                     id="button-medium-img"
//                   />
//                 </button>
//                 <button
//                   class="prio-buttons"
//                   id="button-low"
//                   onclick="setPrio('low')"
//                 >
//                   Low
//                   <img
//                     src="../assets/icons/prio-low.png"
//                     alt="prio low icon"
//                     id="button-low-img"
//                   />
//                 </button>
//               </div>
//             </div>

//             <div class="form-container assigned-to-container">
//               <div
//                 for="assigned to"
//                 class="add-task-labels"
//               >
//                 Assigned to
//               </div>
//               <select
//                 type="text"
//                 id="input-assigned-to"
//                 class="add-task-select"
//                 name="assigned to"
//               >
//                 <option
//                   value="No selection"
//                   disabled
//                   selected
//                   hidden
//                 >
//                   Select contacts to assign
//                 </option>
//                 <option value="Jim Panse">Jim Panse</option>
//                 <option value="Anne Theke">Anne Theke</option>
//                 <option value="Kara Mell">Kara Mell</option>
//               </select>
//             </div>

//             <div class="form-container subtasks-container">
//               <div
//                 for="subtasks"
//                 class="add-task-labels"
//               >
//                 Subtasks
//               </div>
//               <div class="add-task-input">
//                 <input
//                   type="subtasks"
//                   name="subtasks"
//                   placeholder="Add new subtask"
//                   class="add-task-input-subtasks"
//                   id="input-subtask"
//                   oninput="controlSubtaskIcons()"
//                 />
//                 <img
//                   src="../assets/icons/add-subtask.png"
//                   alt="add subtask icon"
//                   id="add-subtask-img"
//                 />
//                 <img
//                   src="../assets/icons/submit-subtask.png"
//                   alt="submit subtask icon"
//                   id="submit-subtask-img"
//                   onclick="submitInputSubtask()"
//                 />
//                 <img
//                   src="../assets/icons/cancel-subtask.png"
//                   alt="plus icon"
//                   id="cancel-subtask-img"
//                   onclick="cancelInputSubtask()"
//                 />
//               </div>
//               <ul
//                 class="subtasks-list"
//                 id="subtasks-list"
//               ></ul>
//             </div>

//             <div class="edit-task-buttons-container">
//               <button
//                 class="add-task-submit-button"
//                 id="${element.id}"
//                 onclick="editTask(event)"
//               >
//                 OK
//                 <img
//                   src="../assets/icons/check.png"
//                   alt="check icon"
//                 />
//               </button>
//             </div>
//       </div>
//   `;
// }

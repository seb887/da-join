/**
 * Generates the HTML structure for a Kanban card element
 *
 * @param {Object} element - The task element to create the card for
 */

function createCardHTML(element) {
  return `
      <div
        class="kanban-card" id="${element.id}"
        onclick="openTaskModal('${element.id}')"
        draggable="true"
        ondragstart="drag(event)"
      >
          <div class="card-label-container">
            <div class="card-label" style="background-color: ${setCategoryBackgroundColor(
              element.data.category
            )}">${element.data.category}
            </div>
            <img
              id="move-board-btn"
              class="move-board-btn"
              src="../assets/icons/dots-vertical.svg"
              alt="dots vertical img"
              onclick="openMoveToCard(
                '${element.id}',
                '${element.data.board}');
                event.stopPropagation()"
            >
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

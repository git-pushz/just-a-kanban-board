"use strict";

let noteCounter = 0;
let zIndexCounter = 1;

const generateNoteId = () => {
  noteCounter++;
  return noteCounter;
}

const generateZIndex = () => {
  zIndexCounter++;
  return zIndexCounter;
}

const removeStickyNote = (stickyNote) => {
  stickyNote.remove();
}

const addStickyNote = (parentBoard) => {
  const noteId = generateNoteId();

  const stickyNoteText = document.createElement("textarea");
  stickyNoteText.setAttribute("name", "note content");
  stickyNoteText.setAttribute("placeholder", "Write note...");
  stickyNoteText.classList.add(...["sticky-note-text"]);

  const stickyNoteBtnClose = document.createElement("button");
  stickyNoteBtnClose.classList.add(...["sticky-note-btn-close"]);
  stickyNoteBtnClose.textContent = "Finish";

  const stickyNoteBody = document.createElement("button");
  stickyNoteBody.classList.add(...["sticky-note-body"]);
  stickyNoteBody.appendChild(stickyNoteText);
  stickyNoteBody.appendChild(stickyNoteBtnClose);

  const draggableOverlay = document.createElement("div");
  draggableOverlay.classList.add(...["draggable-overlay", "hidden"]);
  draggableOverlay.setAttribute("note-id", noteId);

  const stickyNoteBtnThrow = document.createElement("button");
  stickyNoteBtnThrow.classList.add(...["sticky-note-btn-throw"]);
  stickyNoteBtnThrow.textContent = "X";

  const stickyNote = document.createElement("div");
  stickyNote.classList.add(...["sticky-note"]);
  stickyNote.appendChild(stickyNoteBody);
  stickyNote.appendChild(draggableOverlay);
  stickyNote.appendChild(stickyNoteBtnThrow);
  stickyNote.id = `note-${noteId}`;
  stickyNote.style.zIndex = generateZIndex();

  parentBoard.appendChild(stickyNote);

  stickyNoteBtnThrow.addEventListener("click", () => {
    stickyNote.remove();
  });

  stickyNoteBtnClose.addEventListener("click", () => {
    draggableOverlay.classList.toggle("hidden");
    stickyNoteBtnClose.classList.toggle("hidden");
    stickyNoteText.blur();
  });
};

const removeBoardColumn = (boardColumn) => {
  boardColumn.remove();
}

const addBoardColumn = (parentBoard, title="", level=0) => {
  if (level > 1) {
    console.log("Error when adding a column: you cannot add a column of level > 1");
    return;
  }

  const boardColumnBtnAdd = document.createElement("button");
  boardColumnBtnAdd.classList.add(...["board-column-btn-add"]);
  boardColumnBtnAdd.textContent = "ADD";

  const boardColumnBtnAddC = document.createElement("button");
  boardColumnBtnAddC.classList.add(...["board-column-btn-add-c"]);
  boardColumnBtnAddC.textContent = "ADD COLUMN";

  const boardCBB = document.createElement("div");
  boardCBB.classList.add(...["board-c-b-b"]);

  const boardCBH = document.createElement("div");
  boardCBH.classList.add(...["board-c-b-h"]);
  
  if (level == 0) {
    boardCBB.appendChild(boardColumnBtnAdd);
    boardCBH.appendChild(boardColumnBtnAddC);
  }

  const boardColumnBody = document.createElement("div");
  boardColumnBody.classList.add(...["board-column-body"]);
  boardColumnBody.appendChild(boardCBH);
  boardColumnBody.appendChild(boardCBB);

  const boardColumnTitle = document.createElement("textarea");
  boardColumnTitle.classList.add(...["board-column-title"]);
  boardColumnTitle.setAttribute("rows", "1");
  boardColumnTitle.setAttribute("placeholder", "Column title...");
  if (title !== ""){
    boardColumnTitle.textContent = title;
  }

  const boardColumnHeader = document.createElement("board-column-header");
  boardColumnHeader.classList.add(...["board-column-header"]);
  boardColumnHeader.appendChild(boardColumnTitle);

  const boardColumnBtnThrow = document.createElement("button");
  boardColumnBtnThrow.classList.add(...["board-column-btn-throw"]);
  boardColumnBtnThrow.textContent = "X";

  const boardColumn = document.createElement("board-column");
  boardColumn.classList.add(...["board-column"]);
  boardColumn.appendChild(boardColumnHeader);
  boardColumn.appendChild(boardColumnBody);
  boardColumn.appendChild(boardColumnBtnThrow);

  parentBoard.appendChild(boardColumn);
  boardColumnTitle.focus();

  boardColumnBtnThrow.addEventListener("click", () => {
    boardColumn.remove();
  });
  boardColumnBtnAdd.addEventListener("click", () => {
    addStickyNote(boardCBB);
  });
  boardColumnBtnAddC.addEventListener("click", () => {
    addBoardColumn(boardCBB, "", level=1);
  });
}

window.addEventListener('load', function () {
  const board = document.getElementById("board");
  document
    .getElementById("navbar-btn-add")
    ?.addEventListener("click", () => {
      addBoardColumn(board, "", 0);
    });
  addBoardColumn(board, "Backlog", 0);
  addBoardColumn(board, "Breakdown", 0);
  addBoardColumn(board, "Implement", 0);
  addBoardColumn(board, "Validate", 0);
})

interact('.sticky-note .draggable-overlay')
  .draggable({
    inertia: false,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: false,
    listeners: {
      move: dragMoveListener,
    }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move: function (event) {
        const target = event.target;
        const noteId = target.getAttribute("note-id");
        const stickyNote = document.getElementById(`note-${noteId}`);
        stickyNote.style.zIndex = generateZIndex();
        let { x, y } = stickyNote.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        Object.assign(stickyNote.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        });

        Object.assign(stickyNote.dataset, { x, y });
      }
    },
  })
  .on('tap', function (event) {
    const target = event.currentTarget;
    const noteId = target.getAttribute("note-id");
    const stickyNote = document.getElementById(`note-${noteId}`);
    stickyNote.style.zIndex = generateZIndex();

    target.classList.toggle("hidden");
    stickyNote.getElementsByClassName("sticky-note-text")[0].focus()
    stickyNote.getElementsByClassName("sticky-note-btn-close")[0].classList.toggle("hidden");
    event.preventDefault()
  });

function dragMoveListener (event) {
  const target = event.target;
  const noteId = target.getAttribute("note-id");
  const stickyNote = document.getElementById(`note-${noteId}`);
  stickyNote.style.zIndex = generateZIndex();

  const x = (parseFloat(stickyNote.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(stickyNote.getAttribute('data-y')) || 0) + event.dy;

  stickyNote.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  stickyNote.setAttribute('data-x', x);
  stickyNote.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener

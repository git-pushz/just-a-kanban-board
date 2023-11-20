"use strict";

import { boardColumns, addBoardColumn } from "./components/boardColumn.js";
import { notes, addStickyNote } from "./components/stickyNote.js";
import "./components/interactivity.js"


const initialized = localStorage.getItem("initialized") ? true : false;

window.addEventListener('load', async function () {
  // Disable both horizontal and vertical scrolling on mobile
  document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });

  if (!initialized) {
    localStorage.setItem("initialized", "true");
  }
  const board = document.getElementById("board");
  document
    .getElementById("add-column-btn")
    ?.addEventListener("click", () => {
      addBoardColumn(board, 0, "", 0);
    });
  document
    .getElementById("navbar-btn-add-note")
    ?.addEventListener("click", () => {
      addStickyNote(board);
    });

  if (!initialized) {
    addBoardColumn(board, 1, "Backlog", 0);
    addBoardColumn(board, 2, "Breakdown", 0);
    addBoardColumn(board, 3, "Implement", 0);
    addBoardColumn(board, 4, "Validate", 0);
    return;
  }

  for (const [boardColumnId, boardColumn] of Object.entries(boardColumns)) {
    addBoardColumn(board, boardColumnId, boardColumn.title, boardColumn.level);
    for (const [childColId, childCol] of Object.entries(boardColumn.children)) {
      addBoardColumn(document.getElementById(`board-${boardColumnId}`), childColId, childCol.title, childCol.level);
    }
  }

  for (const [key, value] of Object.entries(notes)) {
    console.log({value});
    addStickyNote(board, key, value.dataset.offsetX, value.dataset.offsetY, value.dataset.zIndex, value.dataset.width, value.dataset.height, value.text);
  }

  document.body.addEventListener("wheel", (event) => {
    const target = document.getElementById('board');
    const deltaFactor = 0.1
    const scaleDelta = event.deltaY > 0 ? -deltaFactor : deltaFactor;

    const x = (parseFloat(target.getAttribute('data-x')) || 0);
    const y = (parseFloat(target.getAttribute('data-y')) || 0);
    const scaleFactor = (parseFloat(target.getAttribute('scale-factor')) || 1) + scaleDelta;
    if (scaleFactor < 0.5 || scaleFactor > 2.5) return;

    Object.assign(target.style, {
      transform: `translate(${x}px, ${y}px) scale(${scaleFactor})`
    });

    target.setAttribute('scale-factor', scaleFactor);
  });
})

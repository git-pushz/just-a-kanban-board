"use strict";

import { debounce } from "../utils.js";


let noteCounter = localStorage.getItem("noteCounter")
  ? parseInt(localStorage.getItem("noteCounter"))
  : 0;

let zIndexCounter = localStorage.getItem("zIndexCounter")
  ? parseInt(localStorage.getItem("zIndexCounter"))
  : 1;

const storageNotes = localStorage.getItem("notes");  
export const notes = storageNotes ? JSON.parse(storageNotes) : {};
console.log({notes});

const generateNoteId = () => {
  noteCounter++;
  localStorage.setItem("noteCounter", noteCounter.toString());
  return noteCounter;
}

export const generateZIndex = () => {
  zIndexCounter++;
  localStorage.setItem("zIndexCounter", zIndexCounter.toString());
  return zIndexCounter;
}

export const addStickyNote = (parentBoard, noteId=0, offsetX=0, offsetY=0, zIndex=0, text="") => {
  if (noteId === 0) {
    noteId = generateNoteId();
  }

  const stickyNoteText = document.createElement("textarea");
  stickyNoteText.setAttribute("name", "note content");
  stickyNoteText.setAttribute("placeholder", "Write note...");
  stickyNoteText.classList.add(...["sticky-note-text"]);
  stickyNoteText.textContent = text;

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
  if (zIndex === 0) {
    zIndex = generateZIndex();
  }
  Object.assign(stickyNote.style, {
    zIndex: zIndex,
    transform: `translate(${offsetX}px, ${offsetY}px)`
  })

  parentBoard.appendChild(stickyNote);

  stickyNoteBtnThrow.addEventListener("click", () => {
    stickyNote.remove();
    delete notes[noteId];
    localStorage.setItem("notes", JSON.stringify(notes));
  });

  stickyNoteBtnClose.addEventListener("click", () => {
    draggableOverlay.classList.toggle("hidden");
    stickyNoteBtnClose.classList.toggle("hidden");
    stickyNoteText.blur();
  });

  if (text !== "") {
    stickyNoteBtnClose.click();
  }

  const updateText = debounce((newText) => {
    console.log(newText);
    notes[noteId].text = newText;
    localStorage.setItem("notes", JSON.stringify(notes));
  });
  stickyNoteText.addEventListener("input", () => {
    updateText(stickyNoteText.value);
  });

  notes[noteId] = {
    text: text,
    // boardId: parentBoard.id,
    dataset: {
      offsetX: offsetX,
      offsetY: offsetY,
      width: 0,
      height: 0,
      zIndex: zIndex
    }
  }
};

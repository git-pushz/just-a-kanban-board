"use strict";

import { generateZIndex, notes } from "./stickyNote.js";


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
      move: function(event) {
        const target = event.target;
        const noteId = target.getAttribute("note-id");
        const stickyNote = document.getElementById(`note-${noteId}`);

        const x = notes[noteId].dataset.offsetX + event.dx;
        const y = notes[noteId].dataset.offsetY + event.dy;

        Object.assign(stickyNote.style, {
          transform: `translate(${x}px, ${y}px)`,
          zIndex: generateZIndex()
        });

        notes[noteId].dataset.offsetX = x;
        notes[noteId].dataset.offsetY = y;

      },
      end: function() {
        console.log('after', notes);
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    }
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

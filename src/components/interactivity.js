"use strict";

import { generateZIndex, notes } from "./stickyNote.js";

interact('#board')
  .draggable({
    inertia: false,
    autoScroll: false,
    listeners: {
      move: function(event) {
        const target = event.target;

        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        Object.assign(target.style, {
          transform: `translate(${x}px, ${y}px)`,
        });

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      },
    }
  })
  // .resizable({
  //   edges: { left: true, right: true, bottom: true, top: true },

  //   listeners: {
  //     move (event) {
  //       const target = event.target;
  //       let x = (parseFloat(target.getAttribute('data-x')) || 0);
  //       let y = (parseFloat(target.getAttribute('data-y')) || 0);

  //       x += event.deltaRect.left;
  //       y += event.deltaRect.top;

  //       Object.assign(target.style, {
  //         width: `${event.rect.width}px`,
  //         height: `${event.rect.height}px`,
  //         transform: `translate(${x}px, ${y}px)`
  //       });

  //       target.setAttribute('data-x', x);
  //       target.setAttribute('data-y', y);
  //     }
  //   },
  // })

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
        console.log('after move', notes);
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        const target = event.target;
        const noteId = target.getAttribute("note-id");
        const stickyNote = document.getElementById(`note-${noteId}`);

        const x = notes[noteId].dataset.offsetX + event.deltaRect.left;
        const y = notes[noteId].dataset.offsetY + event.deltaRect.top;

        const width = event.rect.width;
        const height = event.rect.height;

        Object.assign(stickyNote.style, {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${x}px, ${y}px)`,
          zIndex: generateZIndex()
        });

        notes[noteId].dataset.offsetX = x;
        notes[noteId].dataset.offsetX = x;

        notes[noteId].dataset.width = width;
        notes[noteId].dataset.height = height;
      },
      end: function() {
        console.log('after resize', notes);
        localStorage.setItem("notes", JSON.stringify(notes));
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


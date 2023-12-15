"use strict";

import { generateZIndex, notes } from "./stickyNote.js";

interact('body')
  .draggable({
    inertia: false,
    autoScroll: false,
    listeners: {
      move: function(event) {
        const target = document.getElementById("board");

        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        const scaleFactor = parseFloat(target.getAttribute('scale-factor')) || 1;

        event.target.style.cursor = "grabbing";
        Object.assign(target.style, {
          transform: `translate(${x}px, ${y}px) scale(${scaleFactor})`,
        });

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      },
      end: function(event) {
        const target = event.target;
        Object.assign(target.style, {
          cursor: `grab`
        });
      }
    }
  })
  .styleCursor(false)

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

        const boardScaleFactor = (parseFloat(document.getElementById('board').getAttribute('scale-factor')) || 1);

        const x = notes[noteId].dataset.offsetX + event.dx / boardScaleFactor;
        const y = notes[noteId].dataset.offsetY + event.dy / boardScaleFactor;

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


export function initResizableListeners() {
  function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function translateAndScale(target, scaleDelta){
    const x = (parseFloat(target.getAttribute('data-x')) || 0);
    const y = (parseFloat(target.getAttribute('data-y')) || 0);
    const scaleFactor = (parseFloat(target.getAttribute('scale-factor')) || 1) + scaleDelta;
    if (scaleFactor < 0.5 || scaleFactor > 2.5) return;

    Object.assign(target.style, {
      transform: `translate(${x}px, ${y}px) scale(${scaleFactor})`
    });

    target.setAttribute('scale-factor', scaleFactor);
  }

  let isDragging = false;
  let startDistance;

  document.body.addEventListener("wheel", (event) => {
    const target = document.getElementById('board');
    const deltaFactor = 0.1;
    const scaleDelta = event.deltaY > 0 ? -deltaFactor : deltaFactor;
    translateAndScale(target, scaleDelta)
  });

  document.body.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      isDragging = true;
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      startDistance = getDistance(touch1, touch2);
    }
  });

  document.body.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const target = document.getElementById('board');
    const deltaFactor = 0.05;
    if (isDragging && event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = getDistance(touch1, touch2);
      const scaleDelta = currentDistance - startDistance > 0 ? deltaFactor : -deltaFactor;

      translateAndScale(target, scaleDelta);
    }
  });

  document.body.addEventListener("touchend", () => {
    isDragging = false;
  });
}

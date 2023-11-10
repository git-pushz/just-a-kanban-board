"use strict";

import { debounce } from "../utils.js";


const storageBoardColumns = localStorage.getItem("boardColumns");  
export const boardColumns = storageBoardColumns ? JSON.parse(storageBoardColumns) : {};

export let boardCounter = localStorage.getItem("boardCounter") ? parseInt(localStorage.getItem("boardCounter")) : 50;

const generateBoardId = () => {
  boardCounter++;
  localStorage.setItem("boardCounter", boardCounter.toString());
  return boardCounter;
}

export const addBoardColumn = (parentBoard, boardColumnId=0, title="", level=0) => {
  if (level > 1) {
    console.log("Error when adding a column: you cannot add a column of level > 1");
    return;
  }

  // const boardColumnBtnAdd = document.createElement("button");
  // boardColumnBtnAdd.classList.add(...["board-column-btn-add"]);
  // boardColumnBtnAdd.textContent = "ADD";

  const boardColumnBtnAddC = document.createElement("button");
  boardColumnBtnAddC.classList.add(...["board-column-btn-add-c"]);
  boardColumnBtnAddC.textContent = "ADD COLUMN";

  const boardCBB = document.createElement("div");
  boardCBB.classList.add(...["board-c-b-b"]);

  const boardCBH = document.createElement("div");
  boardCBH.classList.add(...["board-c-b-h"]);
  
  if (level == 0) {
    // boardCBB.appendChild(boardColumnBtnAdd);
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

  if (boardColumnId === 0) {
    boardColumnId = generateBoardId();
  }
  boardCBB.setAttribute("board-id", boardColumnId.toString());
  boardCBB.id = `board-${boardColumnId.toString()}`;

  parentBoard.appendChild(boardColumn);
  boardColumnTitle.focus();

  boardColumnBtnThrow.addEventListener("click", () => {
    boardColumn.remove();
    if (level === 0) {
      delete boardColumns[boardColumnId];
    } else {
      delete boardColumns[parseInt(parentBoard.getAttribute("board-id"))]
        .children[boardColumnId];
    }
    localStorage.setItem("boardColumns", JSON.stringify(boardColumns));
  });
  // boardColumnBtnAdd.addEventListener("click", () => {
  //   addStickyNote(document.getElementById("board"));
  // });
  boardColumnBtnAddC.addEventListener("click", () => {
    addBoardColumn(boardCBB, generateBoardId(),"" , level=1);
  });

  const updateTitle = debounce((newTitle) => {
    console.log(newTitle);
    boardColumns[boardColumnId].title = newTitle;
    localStorage.setItem("boardColumns", JSON.stringify(boardColumns));
  });
  boardColumnTitle.addEventListener("input", () => {
    updateTitle(boardColumnTitle.value);
  });

  if (level === 0) {
    boardColumns[boardColumnId] = {
      parentId: parentBoard.getAttribute("board-id"),
      title: title,
      level: level,
      children: {}
    }
  } else {
    boardColumns[parseInt(parentBoard.getAttribute("board-id"))]
      .children[boardColumnId] = {
        parentId: parentBoard.getAttribute("board-id"),
        title: title,
        level: level,
        children: {}
      }
  }
  localStorage.setItem("boardColumns", JSON.stringify(boardColumns));
}

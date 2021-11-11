"use strict";

let board = document.querySelector("div.board");
let dragged;

board.ondragstart = function (event) {
  let card = event.target.closest(".card");

  if (!card || !board.contains(card)) return;

  let currentDroppable = null;
  
  function onDragEnter(event) {
    // highlight potential drop target when the draggable element enters it
    if (!event.target) return;

    let droppableBelow = event.target.closest(".droppable");
    console.log("Enter");
    console.log(droppableBelow);

    currentDroppable = droppableBelow;
    if (!droppableBelow) return;
    droppableBelow.style.backgroundColor = "purple";
  }

  function onDragLeave(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (!event.target) return;

    let droppableBelow = event.target.closest(".droppable");
    console.log("Leave");
    console.log(droppableBelow);

    if (!droppableBelow) return;
    if (currentDroppable == droppableBelow) return;
    droppableBelow.style.backgroundColor = null;
  }

  function onDragEnd(event) {
    console.log("DragEnd");
    console.log(event.target);
    document.removeEventListener("dragenter", onDragEnter);

    document.removeEventListener("dragleave", onDragLeave);
  
    document.removeEventListener("dragend", onDragEnd);
  }

  document.addEventListener("dragenter", onDragEnter);

  document.addEventListener("dragleave", onDragLeave);

  document.addEventListener("dragend", onDragEnd);
};

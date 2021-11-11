"use strict";

let board = document.querySelector("div.board");

board.ondragstart = function (event) {
  let card = event.target.closest(".card");

  if (!card || !board.contains(card)) return;

  let currentDroppable = null;
  let isBelow = null;

  function onDragOver(event) {
    /* events fired on the drop targets */
    // prevent default to allow drop
    event.preventDefault();

    if (!event.target || !board.contains(event.target)) return;

    let droppableBelow = event.target.closest(".droppable");

    if (currentDroppable != droppableBelow) {
      // we're flying in or out...
      // note: both values can be null
      //   currentDroppable=null if we were not over a droppable before this event (e.g over an empty space)
      //   droppableBelow=null if we're not over a droppable now, during this event

      if (currentDroppable) {
        // the logic to process "flying out" of the droppable (remove highlight)
        currentDroppable.classList.remove("top-indicator", "bottom-indicator");
        isBelow = null;
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        // the logic to process "flying in" of the droppable
        updateIndicator(event);
      }
    } else if (currentDroppable != null) {
      // the logic to process "moving in" of the droppable
      updateIndicator(event);
    }
  }

  function updateIndicator(event) {
    let dropModifier = 1;
    if (currentDroppable.classList.contains("drop-below")) {
      dropModifier = 0;
    } else if (currentDroppable.classList.contains("drop-above")) {
      dropModifier = 2;
    }

    let currentDroppableRect = currentDroppable.getBoundingClientRect();
    let relativeY = event.clientY - currentDroppableRect.top;

    if (relativeY >= (currentDroppableRect.height / 2) * dropModifier) {
      if (isBelow == null || isBelow == false) {
        isBelow = true;
        currentDroppable.classList.remove("top-indicator");
        currentDroppable.classList.add("bottom-indicator");
      }
    } else {
      if (isBelow == null || isBelow == true) {
        isBelow = false;
        currentDroppable.classList.remove("bottom-indicator");
        currentDroppable.classList.add("top-indicator");
      }
    }
  }

  function onDrop(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target

    if (currentDroppable) {
      currentDroppable.classList.remove("top-indicator", "bottom-indicator");
      if (card == currentDroppable) {
        // Skip drop card on itself
      } else if (isBelow) {
        currentDroppable.after(card);
      } else {
        currentDroppable.before(card);
      }
      currentDroppable = null;
      isBelow = null;
    }

    document.removeEventListener("dragover", onDragOver);
    document.removeEventListener("drop", onDrop);
  }

  document.addEventListener("dragover", onDragOver);
  document.addEventListener("drop", onDrop);
};

board.onclick = function (event) {
  if (event.target.nodeName != "A") return;

  let href = event.target.innerHTML;
  alert(href); // ...can be loading from the server, UI generation etc

  return false; // prevent browser action (don't go to the URL)
};

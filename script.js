"use strict";

let board = document.querySelector("div.board");

board.onmousedown = function (event) {
  let card = event.target.closest(".card");

  if (!card || !board.contains(card)) return;

  let shiftX = event.clientX - card.getBoundingClientRect().left;
  let shiftY = event.clientY - card.getBoundingClientRect().top;

  moveAt(event.pageX, event.pageY);
  card.style.position = "absolute";
  card.style.opacity = "0.5";

  card.ondragstart = function () {
    return false;
  };

  // board.classList.toggle("mouseDrag");

  function moveAt(pageX, pageY) {
    card.style.left = pageX - shiftX + "px";
    card.style.top = pageY - shiftY + "px";
  }

  // potential droppable that we're flying over right now
  let currentDroppable = null;
  let isBelow = null;

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    card.style.display = "none";
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    card.style.display = null;

    // mousemove events may trigger out of the window (when the ball is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow || !board.contains(elemBelow)) return;

    // potential droppables are labeled with the class "droppable" (can be other logic)
    let droppableBelow = elemBelow.closest(".droppable");

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
    let currentDroppableRect = currentDroppable.getBoundingClientRect();
    let relativeY = event.clientY - currentDroppableRect.top;

    if (relativeY > currentDroppableRect.height / 2) {
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

  function onMouseUp(event) {
    if (currentDroppable) {
      currentDroppable.classList.remove("top-indicator", "bottom-indicator");
      if (isBelow) {
        currentDroppable.after(card);
      } else {
        currentDroppable.before(card);
      }
      currentDroppable = null;
      isBelow = null;
    }

    card.style.position = null;
    card.style.opacity = null;
    card.style.left = null;
    card.style.top = null;
    // board.classList.toggle("mouseDrag");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

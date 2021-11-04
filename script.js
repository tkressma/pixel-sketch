let gridSize = 16;
let ink = "#000000";
const board = document.getElementById("drawingBoard");
const clear = document.getElementById("clearBtn");
const erase = document.getElementById("eraseBtn");
const gridItem = document.getElementsByClassName("grid-item");

clear.addEventListener("click", clearBoard, false);
erase.addEventListener("click", toggleEraser, false);
makeGrid(gridSize);

let toggle = true;
let eraser = false;

function toggleEraser() {
  eraser = !eraser;
}

function makeGrid(size) {
  board.style.setProperty("--grid-rows", size);
  board.style.setProperty("--grid-cols", size);

  for (let i = 0; i < size * size; i++) {
    let cell = document.createElement("div");
    board.appendChild(cell).className = "grid-item";
  }
}

Array.from(gridItem).forEach((v) =>
  v.addEventListener("mousedown", mouseDown, false)
);

Array.from(gridItem).forEach((v) =>
  v.addEventListener(
    "click",
    () => {
      if (eraser === false) {
        v.style.background = "black";
      } else {
        v.style.background = "white";
      }
    },
    false
  )
);

// If a person is drawing, continue listening for a mouse release.
// If released, toggle drawing.
document.body.addEventListener("mouseup", mouseUp, false);
function mouseUp() {
  toggle = false;
}

function mouseDown() {
  toggle = true;

  Array.from(gridItem).forEach((v) =>
    v.addEventListener("mousemove", function () {
      if (toggle && eraser === false) {
        console.log("Starting");
        v.style.background = "black";
      } else if (toggle && eraser === true) {
        v.style.background = "white";
      }
    })
  );
}

function clearBoard() {
  Array.from(gridItem).forEach((v) => (v.style.background = "white"));
}

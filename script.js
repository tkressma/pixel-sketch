let gridSize = 16;
let ink = "#000000";
const board = document.getElementById("drawing-board");
const clear = document.getElementById("clearBtn");
const erase = document.getElementById("eraseBtn");
const gridItem = document.getElementsByClassName("grid-item");
const grid = document.getElementById("gridBtn");
const colorPalette = document.getElementsByClassName("color-palette-option");
const colorPaletteArr = [
  "#000000",
  "#ffffff",
  "#7f7f7f",
  "#c3c3c3",
  "#870016",
  "#b77b59",
  "#ed1b26",
  "#fbafc9",
  "#fb8028",
  "#ffc514",
  "#1eb34f",
  "#b5e619",
  "#01a4e6",
  "#9bd9e8",
  "#3e48d0",
  "#a14aa3",
];
fillColorPallete();
// Fill color pallete
function fillColorPallete() {
  for (let i = 1; i <= colorPalette.length; i++) {
    let currentColor = document.getElementById(`color--${i}`);
    currentColor.style.background = colorPaletteArr[i - 1];
  }
}

grid.addEventListener("click", toggleGrid, false);
clear.addEventListener("click", clearBoard, false);
erase.addEventListener("click", toggleEraser, false);
makeGrid(gridSize);

function toggleGrid() {
  Array.from(gridItem).forEach((element) =>
    element.classList.toggle("grid-item--nogrid")
  );
}

let toggle = true;
let eraser = false;

function toggleEraser() {
  eraser = !eraser;
}

function makeGrid(size) {
  board.style.setProperty("--grid-rows", size);
  board.style.setProperty("--grid-cols", size);

  for (let i = 0; i < size * size; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("grid-item");
    gridElement.setAttribute("draggable", "false");
    board.appendChild(gridElement);
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

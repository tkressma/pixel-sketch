"use strict";

// Drawing Board Vars
let gridSize = 16;
const board = document.getElementById("drawing-board");
const gridItem = document.getElementsByClassName("grid-item");

// Tools Vars
let ink = "#000000";
let backgroundColor = "#ffffff";
const brush = document.getElementById("brushBtn");
const erase = document.getElementById("eraseBtn");
const lighten = document.getElementById("lightenBtn");
const shade = document.getElementById("shadeBtn");
const bucket = document.getElementById("bucketBtn");
const rainbow = document.getElementById("rainbowBtn");

// Color Palette Vars
const colorPaletteContainer = document.getElementById(
  "color-palette-container"
);
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

// Settings Vars
const clear = document.getElementById("clearBtn");
const gridToggle = document.getElementById("gridBtn");
const save = document.getElementById("saveBtn");
const slider = document.getElementById("board-size-slider");
const sliderSizeNumber = document.getElementById("grid-size-number");

// Make the drawing board grid
makeGrid(gridSize);
function makeGrid(size) {
  board.style.setProperty("--grid-rows", size);
  board.style.setProperty("--grid-cols", size);

  for (let i = 0; i < size * size; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("grid-item");
    gridElement.setAttribute("draggable", "false");
    board.appendChild(gridElement);
  }

  initializeDrawing();
}

// Remove all board elements in order to resize the board
function clearBoardElements(board) {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

// Fill color pallete
fillColorPallete();
function fillColorPallete() {
  for (let i = 1; i <= 16; i++) {
    // Dyamically generate all color palette options
    let colorPaletteOption = document.createElement("div");
    colorPaletteOption.classList.add("color-palette-option", "flex");
    colorPaletteOption.setAttribute("id", `color--${i}`);
    colorPaletteContainer.appendChild(colorPaletteOption);

    // Assign each color palette option a color.
    let currentColor = document.getElementById(`color--${i}`);
    currentColor.style.background = colorPaletteArr[i - 1];
  }
}

// Toggle Grid
let toggle = true;
gridToggle.addEventListener("click", toggleGrid);
function toggleGrid() {
  Array.from(gridItem).forEach((element) =>
    element.classList.toggle("grid-item--nogrid")
  );
}

// Clear Board
clear.addEventListener("click", clearBoard);
function clearBoard() {
  Array.from(gridItem).forEach(
    (item) => (item.style.background = backgroundColor)
  );
}

// Grid Size Slider
slider.oninput = () => {
  gridSize = slider.value;
  sliderSizeNumber.innerHTML = `${gridSize}x${gridSize}`;
  clearBoardElements(board);
  makeGrid(gridSize);
};

// Brush and Eraser
erase.addEventListener("click", toggleEraser);
brush.addEventListener("click", toggleBrush);
let eraser = false;

function toggleEraser() {
  eraser = true;
  switchSelectedButton(brush, erase);
}

function toggleBrush() {
  eraser = false;
  switchSelectedButton(erase, brush);
}

function switchSelectedButton(a, b) {
  a.classList.remove("button--selected");
  b.classList.add("button--selected");
}

function initializeDrawing() {
  // Allows the user to color single grid items by clicking once.
  Array.from(gridItem).forEach((item) =>
    item.addEventListener(
      "click",
      () => {
        eraser === false
          ? (item.style.background = ink)
          : (item.style.background = backgroundColor);
      },
      false
    )
  );

  // If a person is drawing, continue listening for a mouse release.
  // If released, toggle drawing.
  Array.from(gridItem).forEach((item) =>
    item.addEventListener("mousedown", draw)
  );

  // Listens for when the user releases the mouse to know when to stop drawing.
  document.body.addEventListener("mouseup", mouseUp, false);
  function mouseUp() {
    toggle = false;
  }

  function draw() {
    toggle = true;
    Array.from(gridItem).forEach((item) =>
      item.addEventListener("mousemove", function () {
        if (toggle && eraser === false) {
          console.log("Starting");
          item.style.background = "black";
        } else if (toggle && eraser === true) {
          item.style.background = "white";
        }
      })
    );
  }
}

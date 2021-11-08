"use strict";

// Drawing Board Vars
let gridSize = 16;
const board = document.getElementById("drawing-board");
const gridItem = document.getElementsByClassName("grid-item");

// Tools Vars
let ink = "#000000";
let backgroundColor = "#ffffff";
let brush = true;
let eraser = false;
let shading = false;
let lighten = false;
const brushBtn = document.getElementById("brushBtn");
const eraseBtn = document.getElementById("eraseBtn");
const lightenBtn = document.getElementById("lightenBtn");
const shadeBtn = document.getElementById("shadeBtn");
const bucketBtn = document.getElementById("bucketBtn");
const rainbowBtn = document.getElementById("rainbowBtn");

// Used when switching between tools
function resetTools() {
  brush = false;
  eraser = false;
  shading = false;
  lighten = false;
}

// Color Picker/Palette Vars
const brushColor = document.getElementById("brush-color-picker");
const boardColor = document.getElementById("board-color-picker");
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
    gridElement.setAttribute("data-inked", false);
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
  Array.from(gridItem).forEach((item) =>
    item.classList.toggle("grid-item--nogrid")
  );
}

// Clear Board
clear.addEventListener("click", clearBoard);
function clearBoard() {
  Array.from(gridItem).forEach((item) => {
    item.style.background = backgroundColor;
    item.setAttribute("data-inked", false);
  });
}

// Grid Size Slider
slider.oninput = () => {
  gridSize = slider.value;
  sliderSizeNumber.innerHTML = `${gridSize}x${gridSize}`;
  clearBoardElements(board);
  makeGrid(gridSize);
};

// Brush and Eraser Tools
eraseBtn.addEventListener("click", () => {
  resetTools();
  eraser = true;
  switchSelectedButton(eraseBtn);
});
brushBtn.addEventListener("click", () => {
  resetTools();
  brush = true;
  switchSelectedButton(brushBtn);
});

// Brush Color Picker
brushColor.oninput = () => {
  ink = brushColor.value;
};

// Background Color Picker
boardColor.oninput = () => {
  backgroundColor = boardColor.value;
  document.querySelectorAll('[data-inked="false"]').forEach((item) => {
    item.style.background = backgroundColor;
  });
};

// Shade Tool
shadeBtn.addEventListener("click", () => {
  switchSelectedButton(shadeBtn);
  resetTools();
  shading = true;
});

function switchSelectedButton(selectedButton) {
  let currentSelection = document.getElementsByClassName("button--selected")[0];
  currentSelection.classList.remove("button--selected");
  selectedButton.classList.add("button--selected");
}

function shadeTool(item) {
  let currentColor = item.style.background;
  let rgb = currentColor.match(/\d+/g);
  let [r, g, b] = rgb;
  item.style.background = `rgb(${r * 0.95}, ${g * 0.95}, ${b * 0.95})`;
}

function initializeDrawing() {
  // Allows the user to color single grid items by clicking once.
  Array.from(gridItem).forEach((item) =>
    item.addEventListener("click", () => {
      if (brush) {
        item.style.background = ink;
        item.setAttribute("data-inked", true);
      } else if (eraser) {
        item.style.background = backgroundColor;
        item.setAttribute("data-inked", false);
      } else if (shading) {
        shadeTool(item);
      }
    })
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
      item.addEventListener("mouseenter", function () {
        if (toggle) {
          if (brush) {
            item.style.background = ink;
            item.setAttribute("data-inked", true);
          } else if (eraser) {
            item.style.background = backgroundColor;
            item.setAttribute("data-inked", false);
          } else if (shading) {
            shadeTool(item);
          }
        }
      })
    );
  }
}

"use strict";

/* ===================== */
/* Variable Declarations */
/* ===================== */

// Drawing Board Vars
let gridSize = 16;
let toggle = false;
const board = document.getElementById("drawing-board");
const gridItem = document.getElementsByClassName("grid-item");

// Tools Vars
let ink = "#000000";
let background = "rgb(255,255,255)";
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

// Initializes the drawing board by generating a board of X by Y "pixels".
makeGrid(gridSize);
function makeGrid(size) {
  board.style.setProperty("--grid-rows", size);
  board.style.setProperty("--grid-cols", size);

  for (let i = 0; i < size * size; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("grid-item");
    gridElement.style.background = "transparent";
    gridElement.setAttribute("data-inked", false);
    gridElement.setAttribute("data-shade", 0);
    board.appendChild(gridElement);
  }
}

/* ===================== */
/* Drawing Functionality */
/* ===================== */

// If a user is holding their mouse down, continue to allow the user to draw.
Array.from(gridItem).forEach((item) =>
  item.addEventListener("mousedown", draw)
);

function draw() {
  toggle = true;
}

// Listens for when the user releases the mouse, disallowing the user to draw.
document.body.addEventListener("mouseup", stopDrawing, false);
function stopDrawing() {
  toggle = false;
}

// Allows the user to either color individual grid items or click and drag to draw.
Array.from(gridItem).forEach((item) =>
  ["mousedown", "mouseenter"].forEach((e) =>
    item.addEventListener(e, () => {
      if (toggle) {
        if (brush) {
          item.style.background = ink;
          item.setAttribute("data-inked", true);
          item.setAttribute("data-shade", 0);
        } else if (eraser) {
          item.style.background = "transparent";
          item.setAttribute("data-inked", false);
          item.setAttribute("data-shade", 0);
        } else if (shading) {
          shadeTool(item, item.getAttribute("data-shade"));
          item.setAttribute("data-inked", true);
        } else if (lighten) {
          lightenTool(item, item.getAttribute("data-shade"));
          item.setAttribute("data-inked", true);
        }
      }
    })
  )
);

/* ===================== */
/* Setting functionality */
/* ===================== */

// Clear Board
clear.addEventListener("click", clearBoard);
function clearBoard() {
  board.style.background = background;
  Array.from(gridItem).forEach((item) => {
    item.style.background = "transparent";
    item.setAttribute("data-inked", false);
    item.setAttribute("data-shade", 0);
  });
}

// Toggle Grid
gridToggle.addEventListener("click", toggleGrid);
function toggleGrid() {
  Array.from(gridItem).forEach((item) =>
    item.classList.toggle("grid-item--nogrid")
  );
}

// Grid Size Slider
slider.oninput = () => {
  gridSize = slider.value;
  sliderSizeNumber.innerHTML = `${gridSize}x${gridSize}`;
  clearBoardElements(board);
  makeGrid(gridSize);
};

// Remove all board elements in order to resize the board
function clearBoardElements(board) {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

/* ===== */
/* Tools */
/* ===== */

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

// Shade Tool
shadeBtn.addEventListener("click", () => {
  switchSelectedButton(shadeBtn);
  resetTools();
  shading = true;
});

// Shade function
function shadeTool(item, shadeValue) {
  // Increase the value of the data-shade attribute.
  item.setAttribute("data-shade", Number(shadeValue) + 1);

  let currentColor = item.style.background;
  if (currentColor === "transparent") currentColor = background;

  let rgb = currentColor.match(/\d+/g);
  let [r, g, b] = rgb;
  r = Number(r);
  g = Number(g);
  b = Number(b);

  // Gradually increase towards darker rgb values.
  item.style.background = `rgb(${r - 10}, ${g - 10}, ${b - 10}`;
}

// Lighten tool
lightenBtn.addEventListener("click", () => {
  switchSelectedButton(lightenBtn);
  resetTools();
  lighten = true;
});

// Lighten function
function lightenTool(item, shadeValue) {
  // Decrease the value of the data-shade attribute.
  item.setAttribute("data-shade", Number(shadeValue) - 1);

  let currentColor = item.style.background;
  if (currentColor === "transparent") currentColor = background;

  let rgb = currentColor.match(/\d+/g);
  let [r, g, b] = rgb;
  r = Number(r);
  g = Number(g);
  b = Number(b);

  // Gradually increase towards darker rgb values.
  item.style.background = `rgb(${r + 10}, ${g + 10}, ${b + 10}`;
}

/* ============= */
/* Color Pickers */
/* ============= */

// Brush Color Picker
brushColor.oninput = () => {
  ink = brushColor.value;
};

// Background Color Picker
boardColor.oninput = () => {
  let color = hexToRgb(boardColor.value);
  let [r, g, b] = [color.r, color.g, color.b];
  background = `rgb(${r},${g},${b})`;
  board.style.background = background;

  for (let i = 0; i < gridItem.length; i++) {
    if (gridItem[i].dataset.shade != 0) {
      gridItem[i].style.background = background;
      adjustShade(
        gridItem[i],
        Number(gridItem[i].getAttribute("data-shade")),
        background
      );
    }
  }
};

// This function ensures the shaded/lightenend areas maintain their values.
function adjustShade(item, shade, bg) {
  let rgb = bg.match(/\d+/g);
  let [r, g, b] = rgb;
  r = Number(r);
  g = Number(g);
  b = Number(b);

  if (shade > 0) {
    console.log(item.style.background);
    for (let i = 0; i < shade; i++) {
      r -= 10;
      g -= 10;
      b -= 10;
    }
    item.style.background = `rgb(${r}, ${g}, ${b}`;
  } else if (shade < 0) {
    console.log("yes");
    for (let i = 0; i > shade; i--) {
      r += 10;
      g += 10;
      b += 10;
    }
    console.log(r);
    item.style.background = `rgb(${r}, ${g}, ${b}`;
  }
}

// Fills the color pallete given the array of pre set colors.
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

// Helper Functions
// Switches the active button style.
function switchSelectedButton(selectedButton) {
  let currentSelection = document.getElementsByClassName("button--selected")[0];
  currentSelection.classList.remove("button--selected");
  selectedButton.classList.add("button--selected");
}

// Converts color codes from hex to rgb.
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// TODO:
// 1) Refractor Code
// 2) Fix bug when data-shade

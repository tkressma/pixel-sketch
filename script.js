"use strict";

/* ===================== */
/* Variable Declarations */
/* ===================== */

// Drawing Board Vars
let gridSize = 16;
let drawing = false;
const board = document.getElementById("drawing-board");
const gridItems = document.getElementsByClassName("grid-item");
let gridItemsArray = Array.from(gridItems);
let grid = toMatrix(gridItemsArray, gridSize);

// Tools Vars
let ink = "#000000";
let background = "rgb(255,255,255)";
let brush = true;
let eraser = false;
let shading = false;
let lighten = false;
let bucket = false;
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
  bucket = false;
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
let undo = document.getElementById("undoBtn");
let redo = document.getElementById("redoBtn");
let redoArr = [],
  redoHistory = [],
  undoArr = [],
  undoHistory = [];

/* =============================== */
/* Board and Drawing Functionality */
/* =============================== */

fillColorPallete();
initDrawingBoard(gridSize);
// Initializes the drawing board by generating a board of X by Y "pixels".
// Upon initialization, each grid item is assigned event listeners to allow
// for drawing functionality.

function initDrawingBoard(size) {
  board.style.setProperty("--grid-rows", size);
  board.style.setProperty("--grid-cols", size);

  for (let i = 0; i < size * size; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("grid-item");
    gridElement.style.background = "transparent";
    gridElement.setAttribute("data-inked", false);
    gridElement.setAttribute("data-shade", 0);
    gridElement.setAttribute("data-id", i);
    board.appendChild(gridElement);
  }
}

// Event delegation to add functionality to each pixel on the board.
board.addEventListener("mousedown", function (e) {
  // Matching strategy. Using event delegation to improve performance.
  if (e.target.classList.contains("grid-item")) draw();
});

// Allows the user to either color individual grid items or click and drag to draw.
["mousedown", "mouseover"].forEach((event) =>
  board.addEventListener(event, function (e) {
    fillGridItem(e);
  })
);

// The following functions (draw, stopDrawing) allow for the undo/redo button.
function draw() {
  console.log("Drawing");
  // Reset the current sketch and clear redo history.
  // Once the user draws, Items items will be added to the undoArr array.
  // That array will then be stored in a history array.
  (undoArr = []), (redoHistory = []);
  // The user has started drawing.
  drawing = true;
}
function stopDrawing() {
  console.log("Stop drawing");
  // If the undoHistory array is too long, remove the oldest sketch.
  // This is to prevent performance issues.
  if (undoHistory.length > 32) {
    undoHistory.shift();
  }
  // Store current sketch into a history log for undo purposes.
  undoHistory.push(undoArr);

  // The user has stopped drawing.
  drawing = false;
  console.log(undoHistory);
}

// This is responsible coloring in each pixel and storing each pixel in the undo array.
// Without this, drawing and undo/redo functionality would not be possible.
const colorAndStoreGridItem = (e) => {
  if (e.buttons == 1 && e.target.classList.contains("grid-item") && drawing) {
    // If a user is drawing and releases their mouse anywhere on the screen,
    // stop drawing. Else, allow the user to seamlessly draw around as long as
    // their mouse is held down. This prevents interrupting the user if their
    // mouse happens to leave the drawing board, which also caused a bug in
    // the undo/redo function.
    console.log();
    document.addEventListener("mouseup", stopDrawing);
    // This object is used to keep track of what color a grid item is prior to being undone.
    let gridItemInfo = {
      id: e.target.getAttribute("data-id"),
      storedColor: e.target.style.background,
      storedShade: e.target.getAttribute("data-shade"),
    };
    // If a grid item has already been added to the current sketch array, ignore it.
    // This prevents the object from storing the wrong color previous to being drawn over.
    if (
      !undoArr.some(
        (gridItemInfo) => gridItemInfo.id === e.target.getAttribute("data-id")
      )
    ) {
      if (bucket === false) undoArr.push(gridItemInfo);
    }

    // Determines the functionality of the drawing based on which tool is selected.
    if (brush) {
      e.target.style.background = ink;
      e.target.setAttribute("data-inked", true);
      e.target.setAttribute("data-shade", 0);
    } else if (eraser) {
      e.target.style.background = "transparent";
      e.target.setAttribute("data-inked", false);
      e.target.setAttribute("data-shade", 0);
    } else if (shading) {
      shadeTool(e.target, e.target.getAttribute("data-shade"));
    } else if (lighten) {
      lightenTool(e.target, e.target.getAttribute("data-shade"));
    } else if (bucket) {
      bucketTool(e.target);
    }
  } else {
    document.removeEventListener("mouseup", stopDrawing);
  }
};

/* ===================== */
/* Setting functionality */
/* ===================== */

save.addEventListener("click", saveImage);
// Save Image
function saveImage() {
  gridItemsArray = Array.from(gridItems);

  let saveNumber = prompt("Which save slot? Enter 'One', 'Two', or 'Three'.");
  let saveOption = `save${saveNumber}`;

  let savedBoard = [];
  for (let item of gridItemsArray) {
    savedBoard.push(item.outerHTML);
  }
  localStorage.setItem(saveOption, JSON.stringify(savedBoard));
  localStorage.setItem(`${saveOption}Background`, JSON.stringify(background));
}

const saveOne = document.getElementById("saveOne");
const saveTwo = document.getElementById("saveTwo");
const saveThree = document.getElementById("saveThree");
saveOne.addEventListener(
  "click",
  function () {
    loadBoard("saveOne");
  },
  false
);
saveTwo.addEventListener(
  "click",
  function () {
    loadBoard("saveTwo");
  },
  false
);
saveThree.addEventListener(
  "click",
  function () {
    loadBoard("saveThree");
  },
  false
);

function loadBoard(saveOption) {
  let savedBoard = JSON.parse(localStorage.getItem(saveOption));
  let savedBackground = JSON.parse(
    localStorage.getItem(`${saveOption}Background`)
  );

  if (savedBoard === null || savedBackground === null) {
    // TODO: Don't allow buttons to be clicked if there is no available save!
    console.log("ERROR: No saved board!");
    return;
  }

  updateSlider(Math.sqrt(savedBoard.length));

  boardColor.value = ConvertRGBtoHex(savedBackground);
  board.style.background = savedBackground;
  background = savedBackground;

  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].outerHTML = savedBoard[i];
  }

  initDrawing();
}

// Clear Board
clear.addEventListener("click", clearBoard);
function clearBoard() {
  board.style.background = background;
  Array.from(gridItems).forEach((item) => {
    item.style.background = "transparent";
    item.setAttribute("data-inked", false);
    item.setAttribute("data-shade", 0);
  });
  undoArr = [];
}

// Toggle Grid
gridToggle.addEventListener("click", toggleGrid);
function toggleGrid() {
  Array.from(gridItems).forEach((item) =>
    item.classList.toggle("grid-item--nogrid")
  );
}

// Grid Size Slider
slider.oninput = () => {
  updateSlider(slider.value);
};

// Updates the slider values based on user input as well as clears and updates the board to the new grid size.
const updateSlider = (sliderInput) => {
  gridSize = sliderInput;
  slider.value = gridSize;
  sliderSizeNumber.innerHTML = `${gridSize}x${gridSize}`;
  clearBoardElements(board);
  initDrawingBoard(gridSize);
};

// Remove all board elements in order to resize the board
function clearBoardElements(board) {
  while (board.firstChild) {
    console.log(board.firstChild);
    board.removeChild(board.firstChild);
  }
}

/* ======================= */
/* Redo/Undo Functionality */
/* ======================= */
undo.addEventListener("click", undoSketch);
redo.addEventListener("click", redoSketch);

function redoSketch() {
  // If the redo history array is empty, do not give the option to undo.
  if (redoHistory.length === 0) {
    console.log("Block button");
  } else {
    // Get the most recently undone sketch
    let sketch = redoHistory[redoHistory.length - 1];
    undoArr = [];

    // Find the specific grid items that are going to be updated to "redo" their past state.
    for (let item of gridItems) {
      for (let nextItem of sketch) {
        let { id, storedColor, storedShade } = nextItem;
        if (item.getAttribute("data-id") === id) {
          // Retrieving information about current item and storing it in an undo storage array.
          storeCurrentGridItemData(item, "undo");

          // Redo grid item to its previous state
          item.style.background = storedColor;
          item.setAttribute("data-shade", storedShade);
        }
      }
    }

    undoHistory.push(undoArr);
    redoHistory.pop();
  }
}

function undoSketch() {
  // If the undo history array is empty, do not give the option to undo.
  if (undoHistory.length === 0) {
    console.log("Block button");
  } else {
    // Get the most recent sketch
    let sketch = undoHistory[undoHistory.length - 1];

    redoArr = [];

    // Find the specific grid items that are going to be updated to "undo" their current state.

    for (let item of gridItems) {
      for (let previousItem of sketch) {
        let { id, storedColor, storedShade } = previousItem;
        if (item.getAttribute("data-id") === id) {
          // Retrieving information about current item and storing it in a redo storage array.
          storeCurrentGridItemData(item, "redo");

          // Undo grid item to its previous state
          item.style.background = storedColor;
          item.setAttribute("data-shade", storedShade);
        }
      }
    }

    redoHistory.push(redoArr);
    undoHistory.pop();
  }
}

/* ===== */
/* Tools */
/* ===== */

// Brush and Eraser Tools
eraseBtn.addEventListener("click", () => {
  switchSelectedButton(eraseBtn);
  resetTools();
  eraser = true;
});
brushBtn.addEventListener("click", () => {
  switchSelectedButton(brushBtn);
  resetTools();
  brush = true;
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
  let [r, g, b] = convertValues(rgb);

  // Gradually increase the rgb values to make them darker.
  setRGBBackground(item, "shade", r, g, b);
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
  let [r, g, b] = convertValues(rgb);

  // Gradually increase rgb values to make them lighter.
  setRGBBackground(item, "lighten", r, g, b);
}

// Bucket tool
bucketBtn.addEventListener("click", () => {
  switchSelectedButton(bucketBtn);
  resetTools();
  bucket = true;
});

function bucketTool(selectedItem) {
  // These generate a 2d grid of the grid items based on the current size of the board. This gives each grid item a specified coordinate.
  gridItemsArray = Array.from(gridItems);
  grid = toMatrix(gridItemsArray, gridSize);

  const visited = new Set();
  // The target color is the color that will be filled and replaced.
  const targetColor = selectedItem.style.background;

  // Retrieve X,Y coordinates of selected position.
  const selectedItemPos = Number(selectedItem.getAttribute("data-id"));
  let posX = Math.floor(selectedItemPos / gridSize);
  let posY = selectedItemPos % gridSize;
  fill(posX, posY, ink);

  // Base case for recursion in the fill function
  function isValid(r, c, pos) {
    if (r < 0 || r > gridSize - 1) return false;
    if (c < 0 || r > gridSize - 1) return false;
    if (
      grid[c] === undefined ||
      grid[r][c].style.background !== targetColor ||
      visited.has(pos)
    )
      return false;
    return true;
  }

  // Flood fill algorithm
  function fill(r, c, newColor) {
    let pos = r + "," + c;
    if (isValid(r, c, pos) === false) return;
    visited.add(pos);
    storeCurrentGridItemData(grid[r][c], "undo");
    grid[r][c].style.background = newColor;

    fill(r + 1, c, newColor);
    fill(r - 1, c, newColor);
    fill(r, c - 1, newColor);
    fill(r, c + 1, newColor);
  }
}

function toMatrix(arr, width) {
  return arr.reduce(function (rows, key, index) {
    return (
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
}

/* ============= */
/* Color Pickers */
/* ============= */

// Brush Color Picker
brushColor.oninput = () => {
  ink = brushColor.value;
};

// Allows a user to select colors from the color palette provided
const colorOption = document.getElementsByClassName("color-palette-option");
Array.from(colorOption).forEach((color) => {
  color.addEventListener("click", () => {
    ink = color.style.background;
    brushColor.value = ConvertRGBtoHex(color.style.background);
  });
});

// Background Color Picker
boardColor.oninput = () => {
  let inputColor = hexToRgb(boardColor.value);
  let { r, g, b } = inputColor;

  background = `rgb(${r},${g},${b})`;
  board.style.background = background;

  for (let i = 0; i < gridItems.length; i++) {
    if (
      gridItems[i].dataset.shade != 0 &&
      gridItems[i].dataset.inked != "true"
    ) {
      gridItems[i].style.background = background;
      adjustShade(
        gridItems[i],
        Number(gridItems[i].getAttribute("data-shade")),
        background
      );
    }
  }
};

// This function ensures the shaded/lightenend areas maintain their values.
function adjustShade(item, shade, bg) {
  let rgb = bg.match(/\d+/g);
  let [r, g, b] = convertValues(rgb);

  if (shade > 0) {
    for (let i = 0; i < shade; i++) {
      r -= 10;
      g -= 10;
      b -= 10;
    }
    setRGBBackground(item, "adjust", r, g, b);
  } else if (shade < 0) {
    for (let i = 0; i > shade; i--) {
      r += 10;
      g += 10;
      b += 10;
    }
    setRGBBackground(item, "adjust", r, g, b);
  }
}

// Fills the color pallete given the array of pre set colors.
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

/* ================ */
/* Helper Functions */
/* ================ */

// Gets the current grid item, stores the current color it has, and adds it to an undo storage array.
function storeCurrentGridItemData(item, tool) {
  let gridItemInfo = {
    id: item.getAttribute("data-id"),
    storedColor: item.style.background,
    storedShade: item.getAttribute("data-shade"),
  };

  tool === "undo" ? undoArr.push(gridItemInfo) : redoArr.push(gridItemInfo);
}

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

// Converts color codes from rgb to hex. Used when picking a color from the color palette.
function ConvertRGBtoHex(color) {
  let rgb = color.match(/\d+/g);
  let [r, g, b] = convertValues(rgb);
  return "#" + ColorToHex(r) + ColorToHex(g) + ColorToHex(b);
}

function ColorToHex(color) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

// Converts strings into number values to be used in the rgb color code
function convertValues(rgb) {
  let r = Number(rgb[0]);
  let g = Number(rgb[1]);
  let b = Number(rgb[2]);
  return [r, g, b];
}

// Determines the background color based on the operation
function setRGBBackground(item, operation, r, g, b) {
  if (
    item.getAttribute("data-shade") == 0 &&
    item.getAttribute("data-inked") != "true"
  ) {
    item.style.background = "transparent";
  } else {
    switch (operation) {
      case "adjust":
        item.style.background = `rgb(${r}, ${g}, ${b}`;
        break;
      case "shade":
        item.style.background = `rgb(${r - 10}, ${g - 10}, ${b - 10}`;
        break;
      case "lighten":
        item.style.background = `rgb(${r + 10}, ${g + 10}, ${b + 10}`;
        break;
    }
  }
}

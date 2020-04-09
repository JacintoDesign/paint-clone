const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const body = document.querySelector("body");

// Global Variables
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
let currentSize = 10;
let bucketColor = "white";
let currentColor = "#A51DAB";
let isMouseDown = false;
let isEraser = false;
let drawnArray = [];

// On Load
createCanvas();

// Setting Brush Size
brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Formatting Brush Size
function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.innerHTML = `0${brushSlider.value}`;
  } else {
    brushSize.innerHTML = brushSlider.value;
  }
}

// Setting Brush Color
brushColorBtn.addEventListener("change", () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Eraser
eraser.addEventListener("click", () => {
  isEraser = true;
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  activeToolEl.innerText = "Eraser";
  currentColor = bucketColor;
  currentSize = 50;
});

// Switch back to Brush
brushIcon.addEventListener("click", switchToBrush);
function switchToBrush() {
  isEraser = false;
  activeToolEl.innerText = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

// Change Background Color
bucketColorBtn.addEventListener("change", () => {
  bucketColor = `#${bucketColorBtn.value}`;
  console.log(bucketColor);
  createCanvas();
  restoreCanvas();
  switchToBrush();
});

// Clear Canvas
clearCanvasBtn.addEventListener("click", () => {
  createCanvas();
  drawnArray = [];
  activeToolEl.innerText = "Canvas Cleared";
  setTimeout(switchToBrush, 1500);
});

// Create Canvas
function createCanvas() {
  canvas.id = "canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  canvas.style.position = "absolute";
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    if (drawnArray[i].eraser == true) {
      // console.log('eraser line');
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Get Mouse Position
function getMousePosition(canvas, event) {
  let boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener("mousedown", () => onMouseDown(canvas, event));
function onMouseDown(canvas, event) {
  isMouseDown = true;
  var currentPosition = getMousePosition(canvas, event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
}

// Mouse Move
canvas.addEventListener("mousemove", () => onMouseMove(canvas, event));
function onMouseMove(canvas, event) {
  if (isMouseDown == true) {
    var currentPosition = getMousePosition(canvas, event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined, undefined, undefined, undefined, undefined);
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, eraser) {
  var line = {
    x: x,
    y: y,
    size: size,
    color: color,
    eraser: eraser,
  };
  // console.log(line);
  drawnArray.push(line);
}

// Mouse Up
canvas.addEventListener("mouseup", onMouseUp);
function onMouseUp() {
  isMouseDown = false;
}

// Save to Local Storage
saveStorageBtn.addEventListener("click", () => {
  // Necessary so that you don't keep adding to array
  localStorage.removeItem("savedCanvas");
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  activeToolEl.innerText = "Canvas Saved";
  setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("savedCanvas") !== null) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    activeToolEl.innerText = "Canvas Loaded";
    setTimeout(switchToBrush, 1500);
  } else {
    activeToolEl.innerText = "No Canvas Found";
    setTimeout(switchToBrush, 1500);
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener("click", () => {
  localStorage.clear();
  activeToolEl.innerText = "Local Storage Cleared";
  setTimeout(switchToBrush, 1500);
});

// Download Image
downloadBtn.addEventListener("click", () =>
  downloadCanvas(downloadBtn, "canvas", "paint-example.jpeg")
);
function downloadCanvas(link, canvas, filename) {
  link.href = document.getElementById(canvas).toDataURL("image/jpeg", 1);
  link.download = filename;
  activeToolEl.innerText = "Image File Saved";
  setTimeout(switchToBrush, 1500);
}

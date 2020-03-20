const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser'); 
const clearCanvasBtn = document.getElementById('clear-canvas'); 
// const addImageBtn = document.getElementById('add-image'); 
const saveStorageBtn = document.getElementById('save-storage'); 
const loadStorageBtn = document.getElementById('load-storage'); 
const clearStorageBtn = document.getElementById('clear-storage'); 
const downloadBtn = document.getElementById('download'); 
const body = document.querySelector('body');

// Global Variables
let canvas = document.createElement('canvas');
let myCanvas = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = 'white';
let currentColor = '#AB2567';
let isMouseDown = false;
let isEraser = false;
let drawnArray = [];

// On startup
createCanvas();

// Setting Brush Size
brushSlider.addEventListener('change', () => {
    currentSize = brushSlider.value;
    if (brushSlider.value < 10) {
        brushSize.innerHTML = `0${brushSlider.value}`;
    } else {
        brushSize.innerHTML = brushSlider.value;
    }
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});

// Eraser
eraser.addEventListener('click', () => {
    isEraser = true;
    brushIcon.style.color = 'white';
    eraser.style.color = 'black';
    activeToolEl.innerText = 'Eraser';
    currentColor = bucketColor;
    currentSize = 50;
});

// Switch back to Brush
brushIcon.addEventListener('click', switchToBrush);
function switchToBrush() {
    isEraser = false;
    activeToolEl.innerText = 'Brush';
    brushIcon.style.color = 'black';
    eraser.style.color = 'white';
    currentColor = `#${brushColorBtn.value}`;
    currentSize = 10;
}

// Change Background Color
bucketColorBtn.addEventListener('change', () => {
    bucketColor = `#${bucketColorBtn.value}`;
    console.log(bucketColor);
    createCanvas();
    restoreCanvas();
    switchToBrush();
});

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
    createCanvas();
    drawnArray = [];
    activeToolEl.innerText = 'Canvas Cleared';
    setTimeout(switchToBrush, 1500);
});

// Create Canvas
function createCanvas() {
    canvas.id = 'canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    canvas.style.position = 'absolute';
    myCanvas.fillStyle = bucketColor;
    myCanvas.fillRect(0, 0, canvas.width, canvas.height);
    body.appendChild(canvas);
    switchToBrush();
}

// Draw what is stored in DrawnArray
function restoreCanvas() {
    for (i = 1; i < drawnArray.length; i++) {
        myCanvas.beginPath();
        myCanvas.moveTo(drawnArray[i-1].x, drawnArray[i-1].y);
        myCanvas.lineWidth = drawnArray[i].size;
        myCanvas.lineCap = 'round';
        if (drawnArray[i].eraser == true) {
            // console.log('eraser line');
            myCanvas.strokeStyle = bucketColor;
        } else {
            myCanvas.strokeStyle = drawnArray[i].color;
        }
        myCanvas.lineTo(drawnArray[i].x, drawnArray[i].y);
        myCanvas.stroke();
    }
}

// Get Mouse Position
function getMousePosition(canvas, event) {
    let boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top
    };
}

// Mouse Down
canvas.addEventListener('mousedown', () => onMouseDown(canvas, event));
function onMouseDown(canvas, event) {
    isMouseDown = true;
    var currentPosition = getMousePosition(canvas, event);
    myCanvas.moveTo(currentPosition.x, currentPosition.y);
    myCanvas.beginPath();
    myCanvas.lineWidth = currentSize;
    myCanvas.lineCap = 'round';
    myCanvas.strokeStyle = currentColor;
}

// Mouse Move
canvas.addEventListener('mousemove', () => onMouseMove(canvas, event));
function onMouseMove(canvas, event) {
    if (isMouseDown == true) {
        var currentPosition = getMousePosition(canvas, event);
        myCanvas.lineTo(currentPosition.x, currentPosition.y);
        myCanvas.stroke();
        storeDrawn(currentPosition.x, currentPosition.y, currentSize, currentColor, isEraser);
    } else {
        storeDrawn(undefined, undefined, undefined, undefined, undefined);
    }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, eraser) {
    var line = {
        'x': x,
        'y': y,
        'size': size,
        'color': color,
        'eraser': eraser
    }
    // console.log(line);
    drawnArray.push(line);
}

// Mouse Up
canvas.addEventListener('mouseup', onMouseUp);
function onMouseUp() {
    isMouseDown = false;
}

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
    // Necessary so that you don't keep adding to array
    localStorage.removeItem('savedCanvas');
    localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
    activeToolEl.innerText = 'Canvas Saved';
    setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
    if (localStorage.getItem('savedCanvas') !== null) {
        drawnArray = JSON.parse(localStorage.savedCanvas);
        restoreCanvas();
        activeToolEl.innerText = 'Canvas Loaded';
        setTimeout(switchToBrush, 1500);
    } else {
        activeToolEl.innerText = 'No Canvas Found';
        setTimeout(switchToBrush, 1500);
    }
});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
    localStorage.clear();
    activeToolEl.innerText = 'Local Storage Cleared';
    setTimeout(switchToBrush, 1500);
});

// Download Image
downloadBtn.addEventListener('click', () => downloadCanvas(downloadBtn, 'canvas', 'paint-example.jpeg'));
function downloadCanvas(link, canvas, filename) {
    link.href = document.getElementById(canvas).toDataURL('image/jpeg', 1);
    link.download = filename;
    activeToolEl.innerText = 'Image File Saved';
    setTimeout(switchToBrush, 1500);
}
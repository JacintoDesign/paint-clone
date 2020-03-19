const brushColorBtn = document.getElementById('brush-color');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser'); 
const clearCanvasBtn = document.getElementById('clear-canvas'); 
const addImageBtn = document.getElementById('add-image'); 
const saveStorageBtn = document.getElementById('save-storage'); 
const loadStorageBtn = document.getElementById('load-storage'); 
const clearStorageBtn = document.getElementById('clear-storage'); 
const downloadBtn = document.getElementById('download'); 

// Global Variables
const canvas = document.getElementById('canvas');
let myCanvas = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = 'dodgerblue';

// Setting Brush Size
brushSlider.addEventListener('change', () => {
    currentSize = brushSlider.value;
    if (brushSlider.value < 10) {
        brushSize.innerHTML = `0${brushSlider.value}`;
    } else {
        brushSize.innerHTML = brushSlider.value;
    }
});

// Create New Canvas (on background color change)
bucketColorBtn.addEventListener('change', () => {
    bucketColor = `#${bucketColorBtn.value}`;
    console.log(bucketColor);
    createCanvas();
})
function createCanvas() {
    myCanvas.fillStyle = bucketColor;
    myCanvas.fillRect(0, 0, canvas.width, canvas.height);
}

// On startup, create canvas
createCanvas();
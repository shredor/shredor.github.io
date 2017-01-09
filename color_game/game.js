var squares = document.querySelectorAll('.square');
var colorDisplay = document.getElementById('colorDisplay');
var messageDisplay = document.querySelector('#message');
var h1= document.querySelector('h1');
var resetButton = document.querySelector('#reset');
var modeButtons = document.querySelectorAll('.mode');

var numSquares = 6;
var colors, pickedColor;

init();

function init() {
    addTouchClasses();
    setupSquares();
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener('click', changeMode)
    }
    resetButton.addEventListener('click', reset);
    reset();
}

function addTouchClasses() {
    if (!('ontouchstart' in window)) return;
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('touchable')
    }
}
function setupSquares() {
    for (i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', function() {
            console.log(messageDisplay, clickedColor, pickedColor)
            var clickedColor = this.style.backgroundColor;
            if (clickedColor == pickedColor) {
                changeColors(pickedColor);
                h1.style.backgroundColor = clickedColor;
                messageDisplay.textContent = 'Correct';
                resetButton.textContent = 'Play Again?';
            } else {
                this.style.backgroundColor = '#232323';
                messageDisplay.textContent = 'Try Again';
            }
        })
    }
}
function changeMode() {
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].classList.remove('selected');
    }
    this.classList.add('selected');
    if (this.textContent == 'Easy') {
        numSquares = 3;
    } else {
        numSquares = 6;
    }
    reset();
}
function reset() {
    colors = generateRandomColors(numSquares);
    pickedColor = pickColor();
    colorDisplay.textContent = pickedColor;
    resetButton.textContent = 'New Colors';
    messageDisplay.textContent = '';
    for (var i = 0; i < numSquares; i++) {
        squares[i].style.display = 'block';
        squares[i].style.backgroundColor = colors[i];
    }
    for (i = numSquares; i < squares.length; i++) {
        squares[i].style.display = 'none';
    }
    h1.style.backgroundColor = '';
}
function changeColors(color) {
    for (var i = 0; i < numSquares; i++) {
        squares[i].style.backgroundColor = color;
    }
}
function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}
function generateRandomColors(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    return arr;
}
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

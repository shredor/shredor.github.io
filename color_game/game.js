!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
	WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
		var target = this;

		registry.unshift([target, type, listener, function (event) {
			event.currentTarget = target;
			event.preventDefault = function () { event.returnValue = false };
			event.stopPropagation = function () { event.cancelBubble = true };
			event.target = event.srcElement || target;

			listener.call(target, event);
		}]);

		this.attachEvent("on" + type, registry[0][3]);
	};

	WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
		for (var index = 0, register; register = registry[index]; ++index) {
			if (register[0] == this && register[1] == type && register[2] == listener) {
				return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
			}
		}
	};

	WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
		return this.fireEvent("on" + eventObject.type, eventObject);
	};
})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);



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

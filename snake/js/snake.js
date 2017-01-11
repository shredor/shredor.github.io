// ========================
//      MODEL
// ========================

var Snake = function (options) {
    this.maxCoords = options.size;
    this.nextSteps = [{
        direction: 'x',
        value: 1
    }];
    this.interval = options.time;
    this.snakeFieldModel = [];
    this.snakeLength = 5;
    this.snakePoints = [];

    this.init();
};

// ========================
//      CONTROLLER
// ========================


// Создаем двумерный массив поля, отмечаем как isActive клетки,
// в которых находится змейка в исходном состоянии
Snake.prototype.createSnakeFieldModel = function () {

    for (var i = 0; i < this.maxCoords.y; i++) {
        this.snakeFieldModel[i] = [];
        for (var j = 0; j < this.maxCoords.x; j++) {

            this.snakeFieldModel[i][j] = {
                coords: {
                    x: j + 1,
                    y: i + 1
                },
                isActive: false,
                isEatable: false
            }
        }
    }

    for (var i = 1; i <= this.snakeLength; i++) {
        this.snakeFieldModel[1][i].isActive = true;
        this.snakePoints.push(this.snakeFieldModel[1][i]);
    }
};

// Функция move меняет модель для каждого шага:
// - getNextStepsCoords: берем координату головы змейки и в соответствии с nextSteps[0]
//   находим новую координату головы змейки
// - если новая координата попала в змейку => gameOver(),
//   иначе активируем newFirstPoint
// - если newFirstPoint не попала еду, то отключаем последнюю клетку змейки,
//   иначе увеличиваем длину змейки и отмечаем как isEatable рандомную клетку с едой
// - если в массиве действий больше одного шага, то удаляем из массива выполненное действие

Snake.prototype.move = function () {
    var newFirstPointCoords = this.getNextStepCoords();
    var newFirstPoint = this.snakeFieldModel[newFirstPointCoords['y'] - 1][newFirstPointCoords['x'] - 1];

    if (newFirstPoint.isActive) {
        this.gameOver(newFirstPoint);
        return
    }
    newFirstPoint.isActive = true;
    this.snakePoints.push(newFirstPoint);
    if (!newFirstPoint.isEatable) {
        this.snakePoints[0].isActive = false;
        this.snakePoints.shift();
    } else {
        this.updateEatablePoint();
        this.snakeLength += 1;
        this.interval *= 1.05;
    }

    if (this.nextSteps.length > 1) {
        this.nextSteps.shift();
    }
};

Snake.prototype.getNextStepCoords = function () {
    var currentCoords = this.snakePoints[this.snakeLength - 1].coords;
    var nextStepCoords = {};
    var nextStep;

    if (this.nextSteps.length > 1) {
        nextStep = this.nextSteps[1];
    } else {
        nextStep = this.nextSteps[0];
    }

    function setNextStepCoords() {
        nextStepCoords.x = currentCoords.x;
        nextStepCoords.y = currentCoords.y;
        nextStepCoords[nextStep.direction] += nextStep.value;
    }

    function checkAndCorrectNextStepCoord(coord) {
        if (nextStepCoords[coord] > this.maxCoords[coord]) {
            nextStepCoords[coord] = 1;
        } else if (nextStepCoords[coord] == 0) {
            nextStepCoords[coord] = this.maxCoords[coord];
        }
    }

    setNextStepCoords.call(this);
    checkAndCorrectNextStepCoord.call(this, 'x');
    checkAndCorrectNextStepCoord.call(this, 'y');

    return nextStepCoords;

};

Snake.prototype.updateEatablePoint = function () {
    if (this.eatablePoint) {
        this.eatablePoint.isEatable = false;
    }
    var inactivePoints = [];
    for (var i = 0; i < this.maxCoords.y; i++) {
        for (var j = 0; j < this.maxCoords.x; j++) {
            if (!this.snakeFieldModel[i][j].isActive) {
                inactivePoints.push(this.snakeFieldModel[i][j])
            }
        }
    }
    var randomIndex = Math.floor(Math.random() * inactivePoints.length);
    this.eatablePoint = inactivePoints[randomIndex];
    this.eatablePoint.isEatable = true;

};

// ========================
//      VIEW
// ========================


// Создаем таблицу в HTML
Snake.prototype.renderSnakeFieldTable = function () {
    var container = document.querySelector('.snake_field_container');
    var table = document.createElement('table');
    table.classList.add('snake-table');
    for (var i = 0; i < this.maxCoords.y; i++) {
        var row = document.createElement('tr');
        row.classList.add('snake-table-row');

        for (var j = 0; j < this.maxCoords.x; j++) {
            var td = document.createElement('td');
            td.classList.add('snake-table-data');
            row.appendChild(td);
        }
        table.appendChild(row)
    }
    container.appendChild(table);
};


// Добавляем классы isActive и isEatable клеткам
Snake.prototype.snakeInitRender = function () {
    this.toggleActiveClasses();
    this.toggleEatableClass();
};


// Убираем классы для isActive и isEatable клеток,
// Делаем следующий шаг,
// Включаем классы для обновленных isActive и isEatable клеток
Snake.prototype.snakeMoveAndRender = function () {
    this.toggleActiveClasses();
    this.toggleEatableClass();
    this.move();
    this.toggleActiveClasses();
    this.toggleEatableClass();
};

Snake.prototype.toggleActiveClasses = function () {
    var table = document.querySelector('table');
    this.snakePoints.forEach(function (snakePoint) {
        var snakePointCell = table.children[snakePoint.coords['y'] - 1].children[snakePoint.coords['x'] - 1];
        snakePointCell.classList.toggle('snake-point');
    });
};

Snake.prototype.toggleEatableClass = function () {
    var table = document.querySelector('table');
    var eatablePointCell = table.children[this.eatablePoint.coords['y'] - 1].children[this.eatablePoint.coords['x'] - 1];
    eatablePointCell.classList.toggle('eatable');
};


// ==============================================

Snake.prototype.init = function () {
    var __self = this;

    this.createSnakeFieldModel();
    this.renderSnakeFieldTable();
    this.updateEatablePoint();
    this.snakeInitRender();

    this.timer = setTimeout(function repeat() {
        __self.snakeMoveAndRender();
        __self.timer = setTimeout(repeat, __self.interval);
    }, this.interval);

    document.body.addEventListener('keydown', this.addStep.bind(this));
};

Snake.prototype.addStep = function (e) {
    var keydownActions = {
        '37': {
            direction: 'x',
            value: -1
        },
        '38': {
            direction: 'y',
            value: -1
        },
        '39': {
            direction: 'x',
            value: 1
        },
        '40': {
            direction: 'y',
            value: 1
        }
    };
    var keyCode = e.keyCode.toString();
    if (
        !(keyCode in keydownActions ) ||
        e.target.repeat ||
        keydownActions[keyCode].direction == this.nextSteps[this.nextSteps.length - 1].direction ||
        this.nextSteps.length > 6
    ) return;
    this.nextSteps.push(keydownActions[keyCode]);
};

Snake.prototype.gameOver = function(failedCell) {
    clearTimeout(this.timer);
    var table = document.querySelector('table');
    var failedCellElement = table.children[failedCell.coords['y'] - 1].children[failedCell.coords['x'] - 1];
    failedCellElement.classList.add('failed');
};

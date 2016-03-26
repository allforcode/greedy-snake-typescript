var GreedySnake;
(function (GreedySnake) {
    (function (CellType) {
        CellType[CellType["Normal"] = 0] = "Normal";
        CellType[CellType["Food"] = 1] = "Food";
        CellType[CellType["SnakeBody"] = 2] = "SnakeBody";
    })(GreedySnake.CellType || (GreedySnake.CellType = {}));
    var CellType = GreedySnake.CellType;
    (function (MoveDirection) {
        MoveDirection[MoveDirection["Up"] = 0] = "Up";
        MoveDirection[MoveDirection["Left"] = 1] = "Left";
        MoveDirection[MoveDirection["Right"] = 2] = "Right";
        MoveDirection[MoveDirection["Down"] = 3] = "Down";
    })(GreedySnake.MoveDirection || (GreedySnake.MoveDirection = {}));
    var MoveDirection = GreedySnake.MoveDirection;
    var GreedySnakeConfig = (function () {
        function GreedySnakeConfig() {
        }
        GreedySnakeConfig.speed = 200;
        GreedySnakeConfig.currentDirection = MoveDirection.Left;
        return GreedySnakeConfig;
    })();
    GreedySnake.GreedySnakeConfig = GreedySnakeConfig;
    var Cell = (function () {
        function Cell(x, y) {
            this.X = x;
            this.Y = y;
            var curRow = (Cell.TableElement.tBodies[0].rows[this.Y]);
            var cellElment = (curRow.cells[this.X]);
            this._CellElment = cellElment;
        }
        Cell.IsValid = function (x, y) {
            if (x > 49 || x < 0 || y > 49 || y < 0) {
                console.log('not valid', x, y);
                return false;
            }
            else {
                console.log('valid', x, y);
                return true;
            }
        };
        Object.defineProperty(Cell.prototype, "X", {
            get: function () {
                return this._X;
            },
            set: function (x) {
                this._X = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "Y", {
            get: function () {
                return this._Y;
            },
            set: function (y) {
                this._Y = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "CellType", {
            get: function () {
                return this._CellType;
            },
            set: function (type) {
                this._CellType = type;
                var bgColor;
                switch (this._CellType) {
                    case CellType.Food:
                        bgColor = 'yellow';
                        break;
                    case CellType.SnakeBody:
                        bgColor = 'black';
                        break;
                    default:
                        bgColor = '';
                        break;
                }
                this._CellElment.style.backgroundColor = bgColor;
            },
            enumerable: true,
            configurable: true
        });
        Cell.prototype.IsFoodCell = function () {
            return this._CellElment.style.backgroundColor == 'yellow';
        };
        Cell.prototype.IsSnakeCell = function () {
            return this._CellElment.style.backgroundColor == 'black';
        };
        Cell.prototype.IsOutOfRange = function () {
            if (this.X > 50 || this.X < 0 || this.Y > 50 || this.Y < 0) {
                return true;
            }
        };
        Cell.prototype.IsNormalCell = function () {
            return this._CellElment.style.backgroundColor == '';
        };
        Cell.TableElement = document.getElementById('tblContainer');
        return Cell;
    })();
    GreedySnake.Cell = Cell;
    var SnakeBody = (function () {
        function SnakeBody(body) {
            this.Body = body;
        }
        Object.defineProperty(SnakeBody.prototype, "Body", {
            set: function (body) {
                SnakeBody._Body = body;
                SnakeBody._Body.forEach(function (item) {
                    item.CellType = CellType.SnakeBody;
                });
            },
            enumerable: true,
            configurable: true
        });
        SnakeBody.prototype.PaintNewBody = function (body, newCell) {
            console.log('new cell: ', newCell.X, newCell.Y);
            if (newCell.IsOutOfRange() || newCell.IsSnakeCell()) {
                this.GameOver();
            }
            else if (newCell.IsFoodCell()) {
                body.unshift(newCell);
                this.Body = body;
            }
            else {
                body.unshift(newCell);
                var lastCell = body.pop();
                lastCell.CellType = CellType.Normal;
                this.Body = body;
            }
        };
        SnakeBody.prototype.goLeft = function () {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX - 1, firstY)) {
                var newCell = new Cell(firstX - 1, firstY);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            }
            else {
                this.GameOver();
            }
        };
        SnakeBody.prototype.goUp = function () {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX, firstY - 1)) {
                var newCell = new Cell(firstX, firstY - 1);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            }
            else {
                this.GameOver();
            }
        };
        SnakeBody.prototype.goDown = function () {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX, firstY + 1)) {
                var newCell = new Cell(firstX, firstY + 1);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            }
            else {
                this.GameOver();
            }
        };
        SnakeBody.prototype.goRight = function () {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX + 1, firstY)) {
                var newCell = new Cell(firstX + 1, firstY);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            }
            else {
                this.GameOver();
            }
        };
        SnakeBody.prototype.GameOver = function () {
            alert('Game Over!');
            window.location.href = 'index.html';
        };
        return SnakeBody;
    })();
    GreedySnake.SnakeBody = SnakeBody;
    window.onload = function () {
        //initialize table element
        var TableElement = document.getElementById('tblContainer');
        var tbody = TableElement.createTBody();
        for (var i = 0; i < 50; i++) {
            var tRow = tbody.insertRow();
            for (var j = 0; j < 50; j++) {
                tRow.insertCell();
            }
        }
        //initialize snake
        var body = new Array();
        var c1 = new Cell(40, 3);
        body.push(c1);
        var c2 = new Cell(41, 3);
        body.push(c2);
        var c3 = new Cell(42, 3);
        body.push(c3);
        var c4 = new Cell(43, 3);
        body.push(c4);
        var snake = new SnakeBody(body);
        //initialize food
        for (var i = 0; i < 10; i++) {
            var x = Math.floor(Math.random() * 50);
            var y = Math.floor(Math.random() * 50);
            var c = new Cell(x, y);
            if (c.IsNormalCell()) {
                c.CellType = CellType.Food;
            }
        }
        var timer;
        timer = setInterval(function () {
            snake.goLeft();
        }, GreedySnakeConfig.speed);
        document.onkeydown = function (e) {
            //left: 37, up: 38, right: 39, down: 40
            clearInterval(timer);
            switch (e.keyCode || e.which) {
                case 37:
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Right) {
                        timer = setInterval(function () {
                            snake.goRight();
                        }, GreedySnakeConfig.speed);
                    }
                    else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Left;
                        timer = setInterval(function () {
                            snake.goLeft();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 38:
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Down) {
                        timer = setInterval(function () {
                            snake.goDown();
                        }, GreedySnakeConfig.speed);
                    }
                    else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Up;
                        timer = setInterval(function () {
                            snake.goUp();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 39:
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Left) {
                        timer = setInterval(function () {
                            snake.goLeft();
                        }, GreedySnakeConfig.speed);
                    }
                    else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Right;
                        timer = setInterval(function () {
                            snake.goRight();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 40:
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Up) {
                        timer = setInterval(function () {
                            snake.goUp();
                        }, GreedySnakeConfig.speed);
                    }
                    else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Down;
                        timer = setInterval(function () {
                            snake.goDown();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 32:
                    clearInterval(timer);
                    break;
            }
        };
    };
})(GreedySnake || (GreedySnake = {}));
//# sourceMappingURL=Snake.js.map
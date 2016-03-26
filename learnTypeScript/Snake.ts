module GreedySnake {
    export enum CellType {
        Normal, Food, SnakeBody
    }

    export enum MoveDirection {
        Up, Left, Right, Down
    }

    export class GreedySnakeConfig {
        static speed: number = 200;
        static currentDirection: MoveDirection = MoveDirection.Left;
    }

    export class Cell {
        private static TableElement: HTMLTableElement = <HTMLTableElement>document.getElementById('tblContainer');
       
        private _X: number;
        private _Y: number;
        private _CellElment: HTMLTableCellElement;
        private _CellType: CellType;

        constructor(x: number, y: number) {
            
            this.X = x;
            this.Y = y;
            var curRow = <HTMLTableRowElement>((<HTMLTableElement>Cell.TableElement.tBodies[0]).rows[this.Y]);
            var cellElment = <HTMLTableCellElement>(curRow.cells[this.X]);
            this._CellElment = cellElment;
        }
        
        static IsValid(x: number, y: number) {
            if (x > 49 || x < 0 || y > 49 || y < 0) {
                console.log('not valid', x, y);
                return false;
            } else {
                console.log('valid', x, y);
                return true;
            }
        }

        get X() {
            return this._X;
        }

        set X(x: number) {
            this._X = x;
        }

        get Y() {
            return this._Y;
        }

        set Y(y: number) {
            this._Y = y;
        }

        get CellType() {
            return this._CellType;
        }

        set CellType(type: CellType) {

            this._CellType = type;
            var bgColor: string;

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
        }

        IsFoodCell() {
            return this._CellElment.style.backgroundColor == 'yellow';
        }

        IsSnakeCell() {
            return this._CellElment.style.backgroundColor == 'black';
        }

        IsOutOfRange() {
            if (this.X > 50 || this.X < 0 || this.Y > 50 || this.Y < 0) {
                return true;
            }
        }

        IsNormalCell() {
            return this._CellElment.style.backgroundColor == '';
        }
    } 

    export class SnakeBody {
        private static _Body: Array<Cell>;
        private static tempBody: Array<Cell>;

        constructor(body: Array<Cell>) {
            this.Body = body;
        }
        
        set Body(body: Array<Cell>) {
            SnakeBody._Body = body;
            SnakeBody._Body.forEach(function (item) {
                item.CellType = CellType.SnakeBody;
            });
        }
        
        PaintNewBody(body: Array<Cell>, newCell: Cell) {
            console.log('new cell: ', newCell.X, newCell.Y);

            if (newCell.IsOutOfRange() || newCell.IsSnakeCell()) {
                this.GameOver();
            } else if (newCell.IsFoodCell()) {
                body.unshift(newCell);
                this.Body = body;
            } else {
                body.unshift(newCell);
                var lastCell = body.pop();
                lastCell.CellType = CellType.Normal;
                this.Body = body;
            }
        }

        goLeft() {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX - 1, firstY)) {
                var newCell = new Cell(firstX - 1, firstY);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            } else {
                this.GameOver();
            }
        }

        goUp() {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX, firstY - 1)) {
                var newCell = new Cell(firstX, firstY - 1);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            } else {
                this.GameOver();
            }
        }

        goDown() {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX, firstY + 1)) {
                var newCell = new Cell(firstX, firstY + 1);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            } else {
                this.GameOver();
            }
        }

        goRight() {
            SnakeBody.tempBody = SnakeBody._Body;
            var firstX = SnakeBody.tempBody[0].X;
            var firstY = SnakeBody.tempBody[0].Y;
            if (Cell.IsValid(firstX + 1, firstY)) {
                var newCell = new Cell(firstX + 1, firstY);
                this.PaintNewBody(SnakeBody.tempBody, newCell);
            } else {
                this.GameOver();
            }
        }

        GameOver() {
            alert('Game Over!');
            window.location.href = 'index.html';
        }
    }
   

    window.onload = function () {
        //initialize table element
        var TableElement: HTMLTableElement = <HTMLTableElement>document.getElementById('tblContainer');
        var tbody = <HTMLTableSectionElement>TableElement.createTBody();
        for (var i = 0; i < 50; i++) {
            var tRow = <HTMLTableRowElement>tbody.insertRow();
            for (var j = 0; j < 50; j++) {
                tRow.insertCell();
            }
        }

        //initialize snake
        var body: Array<Cell> = new Array<Cell>();
        
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

        document.onkeydown = (e) => {
            //left: 37, up: 38, right: 39, down: 40
            clearInterval(timer);
            switch (e.keyCode || e.which) {
                case 37://left
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Right) {
                        timer = setInterval(function () {
                            snake.goRight();
                        }, GreedySnakeConfig.speed);
                    } else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Left;
                        timer = setInterval(function () {
                            snake.goLeft();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 38://up
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Down) {
                        timer = setInterval(function () {
                            snake.goDown();
                        }, GreedySnakeConfig.speed);
                    } else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Up;
                        timer = setInterval(function () {
                            snake.goUp();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 39://right
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Left) {
                        timer = setInterval(function () {
                            snake.goLeft();
                        }, GreedySnakeConfig.speed);
                    } else {
                        GreedySnakeConfig.currentDirection = MoveDirection.Right;
                        timer = setInterval(function () {
                            snake.goRight();
                        }, GreedySnakeConfig.speed);
                    }
                    break;
                case 40://down
                    if (GreedySnakeConfig.currentDirection == MoveDirection.Up) {
                        timer = setInterval(function () {
                            snake.goUp();
                        }, GreedySnakeConfig.speed);
                    } else {
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
        }
    }
}
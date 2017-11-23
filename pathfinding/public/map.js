
class Cell {

    constructor(x, y, mapp) {

        // Cell position
        this.x = x;
        this.y = y;
        this.mapp = mapp;

        this.dist = 9999999;
        this.leftDist = 9999999;
        this.from = null;

        // Boolen if cell is solid
        this.solid = false;
    }

    updateSolidProperty(mouseState) {

        // Set cell solid property depending on mouseState
        if(mouseState == "clear")
            this.solid = false;
        else if(mouseState == "draw")
            this.solid = true;

        // Update cell
        this.draw();
    }

    draw() {

        // Get fill value
        if(this.solid)
            this.drawCellFilled(128, 128, 128);
        else
            this.drawCellFilled(255, 255, 255);
    }

    drawCellFilled(r, g, b) {

        // Set cell border to rgb(100, 100, 100)
        strokeWeight(1);
        stroke(100);

        // Set fill color
        fill(r, g, b);

        // Show rectangle at cell position
        rect(this.x * GRIDSIZE, this.y * GRIDSIZE, GRIDSIZE, GRIDSIZE);
    }

    getNeighbours() {

        var neighbours = [];

        var top = this.addNeighbour(this.x, this.y - 1, neighbours);
        var right = this.addNeighbour(this.x + 1, this.y, neighbours);
        var bottom = this.addNeighbour(this.x, this.y + 1, neighbours);
        var left = this.addNeighbour(this.x - 1, this.y, neighbours);

        if(allowDiagonals)
        {
            if(crossCorners || (top && right))
                this.addNeighbour(this.x + 1, this.y - 1, neighbours);

            if(crossCorners || (bottom && right))
                this.addNeighbour(this.x + 1, this.y + 1, neighbours);

            if(crossCorners || (bottom && left))
                this.addNeighbour(this.x - 1, this.y + 1, neighbours);

            if(crossCorners || (top && left))
                this.addNeighbour(this.x - 1, this.y - 1, neighbours);
        }

        return neighbours;
    }

    addNeighbour(x, y, neighbours) {

        if (x < 0 || x >= this.mapp.cols || y < 0 || y >= this.mapp.rows)
            return false;

        if (this.mapp.grid[x][y].solid)
            return false;

        neighbours.push(this.mapp.grid[x][y]);
        return true;
    }
};

class Map {

    constructor(cols, rows) {

        // Save grid size
        this.cols = cols;
        this.rows = rows;

        // Mouse state "draw", "clear", "moveStart", "moveEnd"
        this.mouseState = "";

        // Create 2D grid arrays
        this.grid = new Array(cols);
        for (var i = 0; i < cols; i++)
            this.grid[i] = new Array(rows);

        // Create grid cells
        for(var x = 0; x < cols; x++) {
            for(var y = 0; y < rows; y++) {

                this.grid[x][y] = new Cell(x, y, this);
            }
        }

        this.setupMainPoints();
    }

    /* -------------------------------------------
     * Mouse events
     * ---------------------------------------- */

    mousePressed() {

        var cell = this.getCellAtPosition(mouseX, mouseY);
        // Out of map - return
        if(cell == null)
            return;

        // Moving start point
        if(cell == start)
        {
            this.mouseState = "moveStart";
            return;
        }
        else if(cell == end)
        {
            this.mouseState = "moveEnd";
            return;
        }

        // Changing solid property
        // What we gonna do (draw or clear)
        else if(cell.solid)
            this.mouseState = "clear";
        else
            this.mouseState = "draw";

        // Update cell
        cell.updateSolidProperty(this.mouseState);
    }

    mouseDragged() {

        var cell = this.getCellAtPosition(mouseX, mouseY);
        // Out of map - return
        if(cell == null)
            return;

        // Moving start position
        if(this.mouseState == "moveStart" && !cell.solid)
        {
            this.clearMainPoints();
            start = cell;
            this.drawMainPoints();
            return;
        }
        // Moving end position
        else if(this.mouseState == "moveEnd" && !cell.solid)
        {
            this.clearMainPoints();
            end = cell;
            this.drawMainPoints();
            return;
        }

        // Dont make start nor end solid
        if(cell == start || cell == end)
            return;

        // Update cell
        cell.updateSolidProperty(this.mouseState);
    }

    /* -------------------------------------------
     * Helper methods
     * ---------------------------------------- */

    getCellAtPosition(x, y) {

        // Get cell position in grid
        var cellX = Math.floor(x / GRIDSIZE);
        var cellY = Math.floor(y / GRIDSIZE);

        // Check if grid position is valid
        if(cellX < 0 || cellX >= this.cols || cellY < 0 || cellY >= this.rows)
            return null;

        // Return cell
        return this.grid[cellX][cellY];
    }

    unsolidCells() {

        // Make all cells unsolid and redraw them
        for(var x = 0; x < this.cols; x++) {
            for(var y = 0; y < this.rows; y++) {

                this.grid[x][y].solid = false;
                this.grid[x][y].draw();
            }
        }
    }

    setupMainPoints() {

        // Calculate positions
        var xPos = Math.floor(this.cols / 4);
        var yPos = Math.floor(this.rows / 2);

        // Setup start position
        start = this.grid[xPos][yPos];
        start.solid = false;

        // Setup end position
        end = this.grid[xPos * 3][yPos];
        end.solid = false;
    }

    getAllCellsCount() {
        return this.cols * this.rows;
    }

    getCellPosition(number) {

        var y = Math.floor(number / mapp.cols);
        var x = number % mapp.cols;

        return [x, y];
    }

    getCell(number) {
        
        var pos = this.getCellPosition(number);

        return this.grid[pos[0]][pos[1]];
    }

    getCellNumber(cell) {

        var n = cell.y * mapp.cols + cell.x;
        return n;
    }

    /* -------------------------------------------
     * Drawing methods
     * ---------------------------------------- */

     draw() {

         for (var x = 0; x < this.cols; x++)
             for (var y = 0; y < this.rows; y++)
                 this.grid[x][y].draw();

         for(var i = 0; i < openSet.length; i++)
             openSet[i].drawCellFilled(80, 146, 252);

         for (var i = 0; i < closedSet.length; i++)
             closedSet[i].drawCellFilled(204, 204, 204);

         this.drawMainPoints();
     }

     drawPath(pathPoint) {

         if(pathPoint.from !== null) {

             var x_start = (pathPoint.x + 0.5) * GRIDSIZE;
             var y_start = (pathPoint.y + 0.5) * GRIDSIZE;
             var x_end = (pathPoint.from.x + 0.5) * GRIDSIZE;
             var y_end = (pathPoint.from.y + 0.5) * GRIDSIZE;

             stroke(179, 66, 244);
             strokeWeight(2);
             line(x_start, y_start, x_end, y_end);

             this.drawPath(pathPoint.from);
         }
     }

    drawGrid() {

        for(var x = 0; x < this.cols; x++) {
            for(var y = 0; y < this.rows; y++) {

                this.grid[x][y].draw();
            }
        }

        this.drawMainPoints();
    }

    // Draw start and end cell
    drawMainPoints() {

        // Start cell
        fill(66, 244, 119);
        rect(start.x * GRIDSIZE, start.y * GRIDSIZE, GRIDSIZE, GRIDSIZE);

        // End cell
        fill(244, 71, 65);
        rect(end.x * GRIDSIZE, end.y * GRIDSIZE, GRIDSIZE, GRIDSIZE);
    }

    // Clear previous position of start and end
    clearMainPoints() {

        start.draw();
        end.draw();
    }
};

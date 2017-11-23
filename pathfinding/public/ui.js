var crossingCornersButton;
var diagonalsButton;

class UI {

    constructor() {

        this.LINE_HEIGHT = 30;

        var pos = [
            width - MENU_WIDTH,
            100
        ];

        // Create UI
        var label = createDiv('Quick options');
        label.position(pos[0], pos[1]);

        // Clearing button
        pos = this.nextLine(pos);
        var button = createButton('Clear walls');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.clearMap);

        // Reset main positions
        pos = this.nextLine(pos);
        var button = createButton('Reset start and end');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.resetMainPositions);

        // Loading saved mazes
        pos = this.nextLine(pos);
        pos = this.nextLine(pos);
        var label = createDiv('Load mazes');
        label.position(pos[0], pos[1]);

        // Generate maze #1
        pos = this.nextLine(pos);
        var button = createButton('Maze #1');
        button.position(pos[0], pos[1]);
        button.mousePressed(firstMaze);

        // Generate maze #2
        pos = this.nextLine(pos);
        var button = createButton('Maze #2');
        button.position(pos[0], pos[1]);
        button.mousePressed(secondMaze);

        // Generate maze #3
        pos = this.nextLine(pos);
        var button = createButton('Maze #3');
        button.position(pos[0], pos[1]);
        button.mousePressed(thirdMaze);

        // Generate maze #4
        pos = this.nextLine(pos);
        var button = createButton('Maze #4');
        button.position(pos[0], pos[1]);
        button.mousePressed(fourthMaze);

        // Generate maze #5
        pos = this.nextLine(pos);
        var button = createButton('Maze #5');
        button.position(pos[0], pos[1]);
        button.mousePressed(fifthMaze);

        // Generate maze #6
        pos = this.nextLine(pos);
        var button = createButton('Maze #6');
        button.position(pos[0], pos[1]);
        button.mousePressed(sixthMaze);

        // Generate maze #7
        pos = this.nextLine(pos);
        var button = createButton('Maze #7');
        button.position(pos[0], pos[1]);
        button.mousePressed(seventhMaze);

        // Export current maze
        pos = this.nextLine(pos);
        var button = createButton('Export maze');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.exportMaze);

        // Algorithms
        pos = this.nextLine(pos);
        pos = this.nextLine(pos);
        var label = createDiv('Pathfinding algorithms');
        label.position(pos[0], pos[1]);

        // Astar
        pos = this.nextLine(pos);
        var button = createButton('A*');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.astar);

        // Astar - Manhattan heuristic
        pos = this.nextLine(pos);
        var button = createButton('A* - Manhattan');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.astarManhattan);

        // Astar - Chebyshev heuristic
        pos = this.nextLine(pos);
        var button = createButton('A* - Chebyshev');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.astarChebyshev);

        // Astar - Octile heuristic
        pos = this.nextLine(pos);
        var button = createButton('A* - Octile');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.astarOctile);

        // Dijkstra
        pos = this.nextLine(pos);
        var button = createButton('Dijkstra');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.dijkstra);

        /*// Floyd
        pos = this.nextLine(pos);
        var button = createButton('Floyd-Warshall');
        button.position(pos[0], pos[1]);
        button.mousePressed(this.floyd);*/

        // Settings
        pos = this.nextLine(pos);
        pos = this.nextLine(pos);
        var label = createDiv('Settings');
        label.position(pos[0], pos[1]);

        // Diagonals
        pos = this.nextLine(pos);
        diagonalsButton = createButton('Forbid diagonals');
        diagonalsButton.position(pos[0], pos[1]);
        diagonalsButton.mousePressed(this.toggleDiagonals);

        // Cross corners
        pos = this.nextLine(pos);
        crossingCornersButton = createButton('Allow crossing corners');
        crossingCornersButton.position(pos[0], pos[1]);
        crossingCornersButton.mousePressed(this.toggleCrossingCorners);
    }

    // Change prinitng position to next line
    nextLine(pos)
    {
        return [pos[0], pos[1] + this.LINE_HEIGHT];
    }

    /* -------------------------------------------
     * Map modification buttons
     * ---------------------------------------- */

    clearMap() {

        // Reset current algorithm
        pathfindingAlgorithm = undefined;

        mapp.unsolidCells();

        // Draw start and end
        mapp.drawMainPoints();
    }

    resetMainPositions() {

        // Reset current algorithm
        pathfindingAlgorithm = undefined;

        // Clear previous map points
        mapp.clearMainPoints();

        // Set main points to default
        mapp.setupMainPoints();

        // Draw main points at new location
        mapp.drawMainPoints();
    }

     exportMaze()
     {
         var ex = "";

         ex += "pathfindingAlgorithm = undefined;\n";
         ex += "mapp.unsolidCells();\n";
         ex += "mapp.clearMainPoints();\n";

         ex += "start = mapp.grid[" + start.x + "][" + start.y + "];\n";
         ex += "end = mapp.grid[" + end.x + "][" + end.y + "];\n";

         for (var x = 0; x < mapp.cols; x++)
             for (var y = 0; y < mapp.rows; y++)
                if(mapp.grid[x][y].solid)
                    ex += ("mapp.grid[" + x + "][" + y + "].solid = " + mapp.grid[x][y].solid + ";\n");

        ex += "start.solid = false;\n";
        ex += "end.solid = false;\n";
        ex += "mapp.drawGrid();\n";

        console.log(ex);
     }

     /* -------------------------------------------
      * Settings
      * ---------------------------------------- */
     toggleDiagonals()
     {
         allowDiagonals = !allowDiagonals;

          if(allowDiagonals)
             diagonalsButton.html("Forbid diagonals");
          else
             diagonalsButton.html("Allow diagonals");
     }

     toggleCrossingCorners()
     {
         crossCorners = !crossCorners;

         if(crossCorners)
            crossingCornersButton.html("Forbid crossing corners");
         else
            crossingCornersButton.html("Allow crossing corners");
     }
     /* -------------------------------------------
      * Pathfinding algorithms
      * ---------------------------------------- */

      astar() {

          // Print start info
          console.log("Starting A*");

          // Set current running algorithm
          pathfindingAlgorithm = new Astar();
      }

      astarManhattan() {

          // Print start info
          console.log("Starting A*");

          // Set current running algorithm
          pathfindingAlgorithm = new AstarManhattan();
      }

      astarChebyshev() {

          // Print start info
          console.log("Starting A*");

          // Set current running algorithm
          pathfindingAlgorithm = new AstarChebyshev();
      }

      astarOctile() {

          // Print start info
          console.log("Starting A*");

          // Set current running algorithm
          pathfindingAlgorithm = new AstarOctile();
      }

      dijkstra() {

          // Print start info
          console.log("Starting Dijkstra");

          // Set current running algorithm
          pathfindingAlgorithm = new Dijkstra();
      }

      floyd() {

          // Print start info
          console.log("Starting FloydWarshall");

          // Set current running algorithm
          pathfindingAlgorithm = new FloydWarshall();
      }
};

GRIDSIZE = 30;
MENU_WIDTH = 200;
var mapp;
var ui;

// Configuration
var allowDiagonals = true;
var crossCorners = false;

// Points which will be drawn
var start, end;
var openSet, closedSet;

// Algroithm
var pathfindingAlgorithm;
var frame = 0;

var iterations = 0;

function setup() {

    // Create canvas
    createCanvas(windowWidth, windowHeight);

    // Calculate number of cols and rows
    var cols = Math.floor((width - MENU_WIDTH) / GRIDSIZE);
    var rows = Math.floor(height / GRIDSIZE);

    // Initialize map and draw it
    mapp = new Map(cols, rows);
    mapp.drawGrid();

    // Create user interface
    ui = new UI(mapp);
}

function draw() {
    frame++;
    if(frame % 1 == 0)
    {
        if(pathfindingAlgorithm != undefined)
            pathfindingAlgorithm.process();
    }
}

function mousePressed() {
    mapp.mousePressed();
}
function mouseDragged() {
    mapp.mouseDragged();
}

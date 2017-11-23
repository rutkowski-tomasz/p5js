var world;
var vehicles;
var debug = true;

function setup() {

    // Create canvas
    createCanvas(800, 400);

    world = new World();
    world.createStart(400, 300);

    vehicles = [];

    var v = new Vehicle(world.start.x, world.start.y, world);
    vehicles.push(v);
}

function draw() {

    background(51);

    world.draw();

    for(var i = vehicles.length - 1; i >= 0; i--) {
        vehicles[i].update();
        vehicles[i].draw();
    }
}

function mousePressed()
{
    world.createRoad(mouseX, mouseY);
}

function mouseDragged()
{
    world.createRoad(mouseX, mouseY);
}

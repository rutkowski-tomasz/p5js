WIDTH = 1000;
HEIGHT = 1000;
CHARTHEIGHT = 300;
var cnv;
var grid;
var statusBar;
var settingsBar;
var generationSlider;
var citiesSlider;
var swapProbabilitySlider, inverseProbabilitSlider, moveProbabilitySlider;
var startButton;
var circleButton;
var doubleCircleButton;
var randomButton;
var knnButton;
var fortniteLootButton;
var clusterButton;

function setup() {

    // Create canvas
    cnv = createCanvas(WIDTH, HEIGHT + CHARTHEIGHT);
    cnv.mouseClicked(function() {
        grid.addPoint(mouseX, mouseY);
    });

    grid = new Grid();

    startButton = createButton("Start algorithm");
    startButton.mouseClicked(function() {
        grid.start();
    });

    circleButton = createButton("Load circle");
    circleButton.mouseClicked(function() {
        grid.loadCircle();
    });

    doubleCircleButton = createButton("Load double circle");
    doubleCircleButton.mouseClicked(function() {
        grid.loadDoubleCircle()
    });

    randomButton = createButton("Load random");
    randomButton.mouseClicked(function() {
        grid.loadRandom();
    });

    knnButton = createButton("Load Knn");
    knnButton.mouseClicked(function() {
        grid.loadKnn();
    });

    fortniteLootButton = createButton("Load fortnite map");
    fortniteLootButton.mouseClicked(function() {
        grid.loadFortniteLoot();
    });


    generationP = createP();
    generationSlider = createSlider(0, 20000, 500);

    citiesP = createP();
    citiesSlider = createSlider(4, 50, 20);

    populationP = createP();
    populationSlider = createSlider(10, 5000, 500);

    swapProbabilityP = createP();
    swapProbabilitySlider = createSlider(0, 100, 20);

    inverseProbabilityP = createP();
    inverseProbabilitySlider = createSlider(0, 100, 20);

    moveProbabilityP = createP();
    moveProbabilitySlider = createSlider(0, 100, 20);
}

function draw() {

    background(51);

    if(grid.working && grid.generation < generationSlider.value())
    {
        grid.selection();

        grid.mutationSwap();
        grid.mutationInverse();
        grid.mutationMove();

        grid.selectBestPath();
    }

    drawChart(50, HEIGHT + 10, WIDTH - 60, CHARTHEIGHT - 50);
    grid.drawCities();

    if(grid.working)
        grid.drawBestPath();

    var p = Math.round(grid.generation / generationSlider.value() * 10000) / 100;
    generationP.html("Current generation: " + grid.generation + "/" + generationSlider.value() + " -> " + p + "% | Bestpath generation: " + grid.bestpathGeneration);

    citiesP.html("Cities: " + citiesSlider.value());
    populationP.html("Population: " + populationSlider.value());
    swapProbabilityP.html("Swap probability: " + swapProbabilitySlider.value() + "%");
    inverseProbabilityP.html("Inverse probability: " + inverseProbabilitySlider.value() + "%");
    moveProbabilityP.html("Move probability: " + moveProbabilitySlider.value() + "%");
}

function drawChart(offsetX, offsetY, chartWidth, chartHeight) {

    var h = grid.history;
    if(h == undefined || h.length <= 1)
        return;

    var minDist = h[h.length - 1].y;
    var maxDist = h[0].y;
    var distDiff = maxDist - minDist;

    var stepx = chartWidth / grid.generation;
    var stepy = chartHeight / distDiff;

    fill(51);
    stroke(255);
    strokeWeight(0.4);

    for(var i = 0; i < h.length; i++) {

        var gen = h[i].x;
        var genDist = h[i].y;

        var cGenDiff = (genDist - minDist);

        ellipse(offsetX + stepx * gen, offsetY + chartHeight - (stepy * cGenDiff), 4, 4);
    }

    var generationStep = Math.floor(grid.generation / 10);
    if(generationStep < 2)
        generationStep = 2;

    for(var i = 1; i < grid.generation; i += generationStep) {

        fill(255);
        noStroke();
        textAlign(CENTER);
        text(i, offsetX + stepx * i, offsetY + chartHeight + 14);

        stroke(128);
        strokeWeight(0.4);
        line(offsetX + stepx * i, offsetY + chartHeight, offsetX + stepx * i, offsetY);
    }

    var distanceStep = Math.floor(distDiff / 10);
    if(distanceStep < 2)
        distanceStep = 2;

    for(var i = minDist; i < maxDist; i += distanceStep) {

        fill(255);
        noStroke();
        textAlign(RIGHT, CENTER);

        var dist = Math.floor(i * 100) / 100;

        var displayText = dist;
        if(dist > 1000)
            displayText = Math.floor(i / 10) / 100 + "k";


        text(displayText, offsetX, offsetY + chartHeight - (stepy * (i - minDist)));

        stroke(128);
        strokeWeight(0.4);
        line(offsetX + stepx, offsetY + chartHeight - (stepy * (i - minDist)), offsetX + chartWidth, offsetY + chartHeight - (stepy * (i - minDist)));
    }
}

function debug()
{
    console.log(" >>> DEBUG <<< ");

    for(var i = 0; i < grid.population.length; i++)
    {
        var p = grid.population[i];
        var d = grid.populationDistances[i];
        console.log("[" + i + "] = " + p + " -> " + d);
    }

    console.log("[b] = " + grid.bestpath + " -> " + grid.bestpathDistance);
}

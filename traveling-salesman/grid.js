
class Grid {

    constructor() {

        this.points = [];

        this.working = false;
        this.generation = 0;
        this.bestpathGeneration = 0;
    }

    start() {

        this.population = new Array(populationSlider.value());
        this.populationDistances = new Array(populationSlider.value());

        this.bestpathDistance = Infinity;
        this.bestpath = new Array(citiesSlider.value());
        this.bestpathGeneration = 0;

        this.generation = 0;
        this.working = true;
        this.history = [];

        this.initializePopulation();

        this.selectBestPath();
    }

    /*
     * Initial setup
     */
    reset() {

        this.points = [];

        this.bestpathDistance = Infinity;
        this.bestpath = new Array(citiesSlider.value());
        this.bestpathGeneration = 0;

        this.working = false;
        this.generation = 0;
    }
    loadCircle() {

        this.reset();

        var angle = 2 * PI / citiesSlider.value();
        var sx = WIDTH / 2, sy = HEIGHT / 2, sr = HEIGHT / 2.1;

        for(var i = 0; i < citiesSlider.value(); i++) {

            var x = sx + sr * sin(i * angle);
            var y = sy + sr * -cos(i * angle);

            this.points[i] = createVector(x, y);
        }
    }
    loadDoubleCircle() {

        this.reset();

        var angle = 4 * PI / citiesSlider.value();
        var sx = WIDTH / 2, sy = HEIGHT / 2, sr = HEIGHT / 2.1, sri = HEIGHT / 8;

        for(var i = 0; i < citiesSlider.value() / 2; i++) {
            var x, y;

            x = sx + sr * sin(i * angle);
            y = sy + sr * -cos(i * angle);

            this.points[i*2] = createVector(x, y);

            x = sx + sri * sin(i * angle);
            y = sy + sri * -cos(i * angle);

            this.points[i*2+1] = createVector(x, y);
        }
    }
    loadRandom() {

        this.reset();

        for(var i = 0; i < citiesSlider.value(); i++) {
            var x = random(20, WIDTH - 20);
            var y = random(20, HEIGHT - 20);

            this.points[i] = createVector(x, y);
        }
    }
    loadKnn() {

        this.reset();

        for(var i = 0; i < citiesSlider.value() / 2; i++) {
            var x, y;

            x = 20 + random(60);
            y = 20 + i * (HEIGHT * 2 / citiesSlider.value()) - 20 + random(40);
            this.points[i*2] = createVector(x, y);

            x = WIDTH - 20 - random(60);
            y = 20 + i * (HEIGHT * 2 / citiesSlider.value()) - 20 + random(40);
            this.points[i*2+1] = createVector(x, y);
        }
    }

    initializePopulation() {

        for(var i = 0; i < this.population.length; i++) {
            this.population[i] = permutation(this.points.length);
            this.populationDistances[i] = this.calculatePath(this.population[i]);
        }
    }

    addPoint(x, y) {
        this.points.push(createVector(x, y));

        this.bestpathDistance = Infinity;
        this.bestpath = new Array(citiesSlider.value());
        this.bestpathGeneration = 0;

        this.working = false;
        this.generation = 0;
    }

    /*
     * Update logic
     */
    selection() {

        this.generation ++;

        var firstRow = permutation(this.population.length);
        var secondRow = permutation(this.population.length);

        this.newPopulation = new Array(this.population.length);
        this.newPopulationDistances = new Array(this.population.length);

        for(var i = 0; i < this.population.length; i++) {

            // Get indexes
            //var k = Math.min(firstRow[i], secondRow[i]);
            //var l = Math.max(firstRow[i], secondRow[i]);

            var k = Math.floor(random(this.population.length)),
                l = Math.floor(random(this.population.length));

            // Check which is shorter path
            if(this.populationDistances[l] < this.populationDistances[k])
                k = l;

            // Copy
            var person = new Array(this.points.length);
            for(var j = 0; j < this.points.length; j++)
                person[j] = this.population[k][j];

            // Add to new population
            this.newPopulation[i] = person;
            this.newPopulationDistances[i] = this.populationDistances[k];
        }

        this.population = this.newPopulation;
        this.populationDistances = this.newPopulationDistances;
    }

    mutationSwap() {

        for(var i = 0; i < this.population.length; i++) {

            if(random(100) >= swapProbabilitySlider.value())
                continue;

            var j = Math.floor(random(this.points.length));
            var k = Math.floor(random(this.points.length));

            this.population[i].swap(j, k);
            this.populationDistances[i] = this.calculatePath(this.population[i]);
        }
    }
    mutationInverse() {

        for(var i = 0; i < this.population.length; i++) {

            if(random(100) >= inverseProbabilitySlider.value())
                continue;

            var r1 = Math.floor(random(this.points.length));
            var r2 = Math.floor(random(this.points.length));

            this.population[i].inverse(r1, r2);
            this.populationDistances[i] = this.calculatePath(this.population[i]);
        }
    }
    mutationMove() {

        for(var i = 0; i < this.population.length; i++) {

            if(random(100) >= moveProbabilitySlider.value())
                continue;

            var j = Math.floor(random(this.points.length));
            var k = Math.floor(random(this.points.length));

            this.population[i].move(j, k);
            this.populationDistances[i] = this.calculatePath(this.population[i]);
        }
    }

    selectBestPath() {

        for(var i = 0; i < this.population.length; i++)
            if(this.populationDistances[i] < this.bestpathDistance)
            {
                this.bestpathDistance = this.populationDistances[i];

                this.bestpath = new Array(this.points.length);
                for(var j = 0; j < this.points.length; j++)
                    this.bestpath[j] = this.population[i][j];

                this.bestpathGeneration = this.generation;

                if(this.generation != 0)
                    this.history.push(createVector(this.generation, this.bestpathDistance));
            }
    }

    calculatePath(path) {

        var d = 0;

        for(var i = 0; i < this.points.length; i++) {

            // Starting point
            var j = path[i];

            // Ending point
            var k = path[0];
            if(i + 1 < this.points.length)
                k = path[i + 1];

            // Positions
            var startX = this.points[j].x;
            var startY = this.points[j].y;

            var endX = this.points[k].x;
            var endY = this.points[k].y;

            // Calculate distance
            d += dist(startX, startY, endX, endY);
        }

        return d;
    }

    /*
     * Drawing logic
     */
    drawCities() {

        for(var i = 0; i < this.points.length; i++) {

            var x = this.points[i].x;
            var y = this.points[i].y;

            stroke(255);
            strokeWeight(1);
            fill(51);

            ellipse(x, y, 10, 10);

            textSize(12);
            fill(255);
            text(i, x + 10, y + 10);
        }
    }
    drawBestPath() {

        for(var i = 0; i < this.points.length; i++) {

            // Starting point
            var j = this.bestpath[i];

            // Ending point
            var k = this.bestpath[0];
            if(i + 1 < this.points.length)
                k = this.bestpath[i + 1];

            // Positions
            var startX = this.points[j].x;
            var startY = this.points[j].y;

            var endX = this.points[k].x;
            var endY = this.points[k].y;

            // Set line color
            var from = color(255, 0, 0);
            var to = color(0, 255, 0);

            var d = dist(startX, startY, endX, endY);
            var mapped = 1 - map(d, 0, WIDTH, 0, 1);
            var lineColor = lerpColor(from, to, mapped);

            // Draw line
            stroke(lineColor);
            strokeWeight(1);
            line(startX, startY, endX, endY);
        }
    }
}

function permutation(size) {

    var arr = new Array(size);
    for(var i = 0; i < size; i++) {
        arr[i] = i;
    }

    for(var i = 0; i < size; i++) {
        var index = Math.floor(random(size - i));

        var temp = arr[size - 1 - i];

        arr[size - 1 - i] = arr[index];
        arr[index] = temp;
    }

    return arr;
}

Array.prototype.swap = function(a, b) {
    var temp = this[a];
    this[a] = this[b];
    this[b] = temp;
}
Array.prototype.inverse = function(r1, r2) {

    var k = Math.min(r1, r2);
    var l = Math.max(r1, r2);

    for(var p = 0; p < (l - k) / 2; p++) {
        this.swap(k + p, l - p);
    }
}
Array.prototype.move = function(j, k) {

    var move = j - k;
    var temp = this[j];

    // 2 - 4
    if(move < 0)
        for(var i = j; i < k; i++)
            this.swap(i, i + 1);

    // 4 - 2
    else if(move > 0)
        for(var i = j; i > k; i--)
            this.swap(i, i - 1);

    this[k] = temp;
}

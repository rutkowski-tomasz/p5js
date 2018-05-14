class Kmeans {

    constructor() {
        this.means = null;
        this.assignments = [];
    }

    clusterize(data, meansCount) {

        this.data = data;
        this.dataExtremes = this.getDataExtremes(this.data);
        this.means = this.initMeans(meansCount);
        this.colors = this.loadRandomColors(meansCount);
    
        this.assignments = this.makeAssignments();

        let moved = true;
        while(moved)
            moved = this.moveMeans();

        return this.means;
    }
    
    // Get max and min of each dimension
    getDataExtremes(points) {
    
        let extremes = { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity };

        for (const point of this.data)
        {
            extremes.xmin = Math.min(extremes.xmin, point.x);
            extremes.xmax = Math.max(extremes.xmax, point.x);

            extremes.ymin = Math.min(extremes.ymin, point.y);
            extremes.ymax = Math.max(extremes.ymax, point.y);
        }
    
        return extremes;
    }
    
    // Randomly place k means
    initMeans(k) {

        return Array( k ).fill(null).map(() => ({
            x: this.getRandomInt(this.dataExtremes.xmin, this.dataExtremes.xmax),
            y: this.getRandomInt(this.dataExtremes.ymin, this.dataExtremes.ymax)
        }));
    }

    // Assign each point to closest mean
    makeAssignments() {

        let assignments = Array( this.data.length ).fill(-1);

        for (let pointIndex = 0; pointIndex < this.data.length; pointIndex++) {

            const distances = Array( this.means.length ).fill(Infinity).map((v, i) => 
                Math.pow(this.data[pointIndex].x - this.means[i].x, 2) + Math.pow(this.data[pointIndex].y - this.means[i].y, 2)
            );

            // Find closest mean and assign current point to it
            assignments[pointIndex] = distances.indexOf(Math.min(...distances));
        }
    
        return assignments;
    }

    // Move means so it will be placed in average points position
    moveMeans() {

        this.makeAssignments();
    
        let sums = Array( this.means.length ).fill(null).map(() => ({ x: 0, y: 0 }));
        let counts = Array( this.means.length ).fill(0);
        let moved = false;

        for (let assignmentsIndex = 0; assignmentsIndex < this.assignments.length; assignmentsIndex++)
        {
            const meanIndex = this.assignments[assignmentsIndex];
            const point = this.data[assignmentsIndex];

            counts[meanIndex]++;
            sums[meanIndex].x += point.x;
            sums[meanIndex].y += point.y;
        }
    
        for (let meanIndex = 0; meanIndex < sums.length; meanIndex++)
        {
            if ( counts[meanIndex] === 0) 
            {
                sums[meanIndex].x = this.getRandomInt(this.dataExtremes.xmin, this.dataExtremes.xmax);
                sums[meanIndex].y = this.getRandomInt(this.dataExtremes.ymin, this.dataExtremes.ymax);

                continue;
            }
            
            sums[meanIndex].x /= counts[meanIndex];
            sums[meanIndex].y /= counts[meanIndex];

            if(this.means[meanIndex].x !== sums[meanIndex].x || this.means[meanIndex].y !== sums[meanIndex].y)
                moved = true;
        }
    
        this.means = sums;
        return moved;
    }

    /*
     * Drawing logic
     */
    drawMeans() {

        // Algorithm havent started yet
        if(this.means === null)
            return;

        // Draw all mean centers
        for(let i = 0; i < this.means.length; i++) {

            stroke(255);
            strokeWeight(1);
            fill(this.colors[i][0], this.colors[i][1], this.colors[i][2]);

            ellipse(this.means[i].x, this.means[i].y, 10, 10);
        }

        // Draw lines to each point that belongs to mean
        for(let i = 0; i < this.assignments.length; i++)
        {
            const meanIndex = this.assignments[i];

            stroke(this.colors[meanIndex][0], this.colors[meanIndex][1], this.colors[meanIndex][2]);
            strokeWeight(1);
            line(this.means[meanIndex].x, this.means[meanIndex].y, this.data[i].x, this.data[i].y);
        }
    }

    /*
     * Helper functions
     */
    loadRandomColors(count) {
        return Array( this.means.length ).fill(0).map(() => this.getRandomColor());
    }

    getRandomColor() {
        return [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    clearMeans() {
        this.means = null;
    }
}
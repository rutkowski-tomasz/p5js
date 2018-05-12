class Kmeans {

    constructor() {
        this.means = null;
        this.assignments = [];
    }

    clusterize(data, meansCount) {

        var convertedData = [];
        for(var point of data)
            convertedData.push([point.x, point.y]);

        this.data = convertedData;
        this.dataExtremes = this.getDataExtremes(this.data);
        this.dataRange = this.getDataRanges(this.dataExtremes);
        this.means = this.initMeans(meansCount);
        this.colors = this.loadRandomColors(meansCount);
    
        this.assignments = this.makeAssignments();

        var moved = true;
        while(moved)
            moved = this.moveMeans();

        return this.means;
    }


    getDataRanges(extremes) {

        var ranges = [];
        for (var dimension in extremes)
            ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    
        return ranges;
    
    }
    
    getDataExtremes(points) {
    
        var extremes = [];
        for (var point of this.data)
        {
            for (var dimension in point)
            {
                if ( ! extremes[dimension] )
                    extremes[dimension] = {min: Infinity, max: 0};
    
                if (point[dimension] < extremes[dimension].min)
                    extremes[dimension].min = point[dimension];
    
                if (point[dimension] > extremes[dimension].max)
                    extremes[dimension].max = point[dimension];
            }
        }
    
        return extremes;
    }
    
    initMeans(k) {

        var means = [];
        if ( ! k )
            k = 3;
    
        while (k--) {
            var mean = [];
    
            for (var dimension in this.dataExtremes)
                mean[dimension] = this.dataExtremes[dimension].min + ( Math.random() * this.dataRange[dimension] );
    
            means.push(mean);
        }
    
        return means;
    }

    makeAssignments() {

        let assignments = [];
        for (const point of this.data) {

            var distances = [];
            for (const mean of this.means) {

                var sum = 0;
                for (var i = 0; i < point.length; i++)
                    sum += Math.pow(point[i] - mean[i], 2);
    
                distances.push(sum);
            }
    
            var closestCluster = distances.indexOf(Math.min(...distances));
            assignments.push(closestCluster);
        }
    
        return assignments;
    }
    moveMeans() {

        this.makeAssignments();
    
        var sums = Array( this.means.length );
        var counts = Array( this.means.length );
        var moved = false;
    
        for (var j in this.means)
        {
            counts[j] = 0;
            sums[j] = Array( this.means[j].length );
            for (var dimension in this.means[j])
            {
                sums[j][dimension] = 0;
            }
        }
    
        for (var point_index in this.assignments)
        {
            var mean_index = this.assignments[point_index];
            var point = this.data[point_index];
            var mean = this.means[mean_index];
    
            counts[mean_index]++;
    
            for (var dimension in mean)
                sums[mean_index][dimension] += point[dimension];
        }
    
        for (var mean_index in sums)
        {
            if ( 0 === counts[mean_index] ) 
            {
                sums[mean_index] = this.means[mean_index];
                console.log("Mean with no points");
    
                for (var dimension in this.dataExtremes)
                    sums[mean_index][dimension] = this.dataExtremes[dimension].min + ( Math.random() * this.dataRange[dimension] );
                    
                continue;
            }
    
            for (var dimension in sums[mean_index])
            {
                sums[mean_index][dimension] /= counts[mean_index];
            }
        }
    
        if (this.means.toString() !== sums.toString())
            moved = true;
    
        this.means = sums;
        return moved;
    }

    /*
     * Drawing logic
     */
    drawMeans() {

        if(this.means == null)
            return;

        for(var i = 0; i < this.means.length; i++) {

            var x = this.means[i][0];
            var y = this.means[i][1];

            stroke(255);
            strokeWeight(1);
            fill(this.colors[i][0], this.colors[i][1], this.colors[i][2]);

            ellipse(x, y, 10, 10);
        }

        for(var i = 0; i < this.assignments.length; i++)
        {
            var meanIndex = this.assignments[i];

            var startX = this.means[meanIndex][0];
            var startY = this.means[meanIndex][1];
            var endX = this.data[i][0];
            var endY = this.data[i][1];

            stroke(this.colors[meanIndex][0], this.colors[meanIndex][1], this.colors[meanIndex][2]);
            strokeWeight(1);
            line(startX, startY, endX, endY);
        }
    }
    loadRandomColors(count) {

        var colors = [];

        for(var i = 0; i < count; i++)
            colors[i] = [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];

        return colors;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
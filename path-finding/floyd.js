

class FloydWarshall {

    constructor() {

        start.dist = 0;
        start.leftDist = calcDistance(start, end);

        end.leftDist = 0;

        openSet = [];
        closedSet = [];

        openSet.push(start);

        var count = mapp.getAllCellsCount();
        this.distances = new Array(count);
        for(var i = 0; i < count; i++)
            this.distances[i] = new Array(count);

        for(var i = 0; i < mapp.cols * mapp.rows; i++)
        {
            var pos = mapp.getCellPosition(i);
            var v1 = mapp.grid[pos[0]][pos[1]];

            if(v1.solid)
                continue;

            var neighbours = v1.getNeighbours();
            for(var j = 0; j < neighbours.length; j++)
            {
                var v2 = neighbours[j];
                var dist = calcDistance(v1, v2);

                this.distances[mapp.getCellNumber(v1)][mapp.getCellNumber(v2)] = dist;
                this.distances[mapp.getCellNumber(v2)][mapp.getCellNumber(v1)] = dist;
            }
        }
    }

    process() {

        var count = mapp.getAllCellsCount()
        for(var a = 0; a < count; a++)
        {
            for(var b = 0; b < count; b++)
            {
                for(var c = 0; c < count; c++)
                {
                    var u = mapp.getCell(a);
                    var v1 = mapp.getCell(b);
                    var v2 = mapp.getCell(c);

                    if(this.distances[b][a] == undefined || this.distances[a][c] == undefined)
                        continue;

                    if(this.distances[b][c] == undefined || this.distances[b][c] > this.distances[b][a] + this.distances[a][c]) {

                        this.distances[b][c] = this.distances[b][a] + this.distances[a][c];
                        v1.from = v2;
                    }


                }
            }
        }

        if (openSet.length == 0)
            return;

        var closestSpot = this.getClosest(openSet);


        if (closestSpot == end)
        {
            console.log("Found path, dist: " + end.dist);
            mapp.draw();
            mapp.drawPath(end);
            return;
        }

        var index = openSet.indexOf(closestSpot);
        openSet.splice(index, 1);

        closedSet.push(closestSpot);

        var neighbours = closestSpot.getNeighbours();

        for (var i = 0; i < neighbours.length; i++)
        {
            var n = neighbours[i];

            if(closedSet.indexOf(n) == -1)
            {
                var tempDist = closestSpot.dist;
                tempDist += calcDistance(closestSpot, n);
                var newPath = false;

                if(openSet.indexOf(n) != -1)
                {
                    if (tempDist < n.dist)
                        newPath = true;
                }
                else
                {
                    newPath = true;
                    openSet.push(n);
                }

                if(newPath)
                {
                    n.dist = tempDist;
                    n.leftDist = calcDistance(n, end);
                    n.from = closestSpot;
                }

            }
        }

        mapp.draw();
        mapp.drawPath(closestSpot);
    }

    getClosest(set) {

        var num = 0;
        for (var i = 1; i < set.length; i++)
            for (var j = 1; j < set.length; j++)
                if (set[i].dist + set[j].dist < set[i].dist + set[j].leftDist + set[j].dist + set[i].leftDist)
                {
                    set[num].dist = set[i].dist + set[j].dist;
                }

        return set[num];
    }
};

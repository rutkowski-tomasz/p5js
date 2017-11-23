
class AstarBase {

    constructor() {
        this.heuristic = function(a, b) {
            return 0;
        };

        start.dist = 0;
        start.leftDist = this.calcDistance(start, end);

        end.leftDist = 0;

        openSet = [];
        closedSet = [];

        openSet.push(start);
        iterations = 0;
    }

    process() {

        iterations += 1;

        if (openSet.length == 0)
        {
            console.log("Can't find shortest path");
            pathfindingAlgorithm = undefined;
            return;
        }

        var closestSpot = this.getClosest(openSet);

        if (closestSpot == end)
        {
            console.log("Found path, dist: " + end.dist + " iterations: " + iterations);
            mapp.draw();
            mapp.drawPath(end);
            pathfindingAlgorithm = undefined;
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
                tempDist += this.calcDistance(closestSpot, n);
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
                    n.leftDist = this.heuristic(n, end);
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
            if (set[i].dist + set[i].leftDist < set[num].dist + set[num].leftDist)
                num = i;

        return set[num];
    }

    calcDistance(a, b) {
       return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
};

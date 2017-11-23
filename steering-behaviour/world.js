class World {

    constructor()
    {
        this.road = [];
        this.roadSize = 50;
        this.start = createVector(0, 0);
    }

    createRoad(x, y)
    {
        var vector = createVector(x, y);
        this.road.push(vector);
    }

    isOnRoad(x, y)
    {
        for(var i = this.road.length - 1; i >= 0; i--)
        {
            var o = this.road[i];
            var distanceSquared = Math.pow(o.x - x, 2) + Math.pow(o.y - y, 2);
            var roadSizeSquared = Math.pow(this.roadSize / 2, 2);

            if(distanceSquared < roadSizeSquared)
                return true;
        }

        return false;
    }

    createStart(x, y)
    {
        this.start.x = x;
        this.start.y = y;
    }


    draw()
    {
        // Draw road parts
        fill(255, 255, 255);
        noStroke();

        for(var i = this.road.length - 1; i >= 0; i--)
        {
            var o = this.road[i];
            ellipse(o.x, o.y, this.roadSize, this.roadSize);
        }

        // Draw start
        fill(6, 240, 30);
        //ellipse(this.start.x, this.start.y, 20, 20);
    }

}

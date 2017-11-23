class Vehicle {

    constructor(x, y, world)
    {
        this.world = world;
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);

        this.r = 5;
        this.checkRadius = 30;
        this.maxvelocity = 3;
        this.maxacceleration = 0.8;

        this.dna = [];

        this.dna[0] = 16;
        this.dna[1] = 32;
        this.dna[2] = 4;
        this.dna[3] = 8;
    }

    update()
    {
        var startAngle, endAngle;
        // Angles check
        var theta = this.velocity.heading();
            var pos = this.position;
        for(var angle = -40; angle <= 40; angle += 20)
        {
            var x = this.checkRadius * cos(theta + (angle * PI / 180));
            var y = this.checkRadius * sin(theta + (angle * PI / 180));

            var trace = this.checkTrace(pos.x, pos.y, pos.x + x, pos.y + y);

            if(!trace)
            {
                if(startAngle == undefined)
                    startAngle = angle;

                endAngle = angle;
            }
        }

        if(startAngle == undefined)
            return;

        var movementAngle = (startAngle + endAngle) / 2;



        var movementVector = createVector(cos(theta + (movementAngle * PI / 180)) * this.checkRadius, sin(theta + (movementAngle * PI / 180)) * this.checkRadius);
        var steering = movementVector.sub(this.velocity);

        steering.limit(this.maxacceleration);

        this.velocity.add(steering);
        this.velocity.limit(this.maxvelocity);

        this.position.add(this.velocity);
    }

    draw()
    {
        var pos = this.position;
        // Color based on health
        var col = color(0, 255, 0);

        // Draw a triangle rotated in the direction of velocity
        var theta = this.velocity.heading();
        push();
        translate(pos.x, pos.y);
        rotate(theta);

        // Extra info
        noFill();

        // Angles check
        if(debug)
        for(var angle = -40; angle <= 40; angle += 20)
        {
            var x = this.checkRadius * cos(theta + (angle * PI / 180));
            var y = this.checkRadius * sin(theta + (angle * PI / 180));

            stroke(0, 255, 0, 100);
            var trace = this.checkTrace(pos.x, pos.y, pos.x + x, pos.y + y);

            if(trace)
                stroke(255, 0, 0, 100);

            var drawX = this.checkRadius * cos((angle * PI / 180));
            var drawY = this.checkRadius * sin((angle * PI / 180));
            line(0, 0, drawX, drawY);
        }

        // Draw the vehicle itself
        fill(col);
        stroke(col);

        beginShape();
            vertex(this.r * 2, 0);
            vertex(-this.r * 2, this.r);
            vertex(-this.r * 2, -this.r);
        endShape(CLOSE);

        pop();
    }

    checkTrace(x1, y1, x2, y2)
    {
        var checks = 30;
        var diffX = x2 - x1;
        var diffY = y2 - y1;

        for(var c = 1; c <= checks; c++)
        {
            var currentX = x1 + ((diffX / checks) * c);
            var currentY = y1 + ((diffY / checks) * c);

            if(!this.world.isOnRoad(currentX, currentY))
                return true;
        }

        return false;
    }
}

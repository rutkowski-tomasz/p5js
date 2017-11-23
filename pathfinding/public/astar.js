
class Astar extends AstarBase {
    constructor() {
        super();
        //euclidean heuristic
        this.heuristic = function(a, b) {

            var dx = Math.abs(a.x - b.x);
            var dy = Math.abs(a.y - b.y);
                        
            return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        }
    }
};

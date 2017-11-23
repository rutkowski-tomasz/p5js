class AstarManhattan extends AstarBase {
    constructor() {
        super();
        //manhattan heuristic
        this.heuristic = function(a, b) {
            var dx = Math.abs(a.x - b.x);
            var dy = Math.abs(a.y - b.y);
            return dx + dy;
        }
    }
};

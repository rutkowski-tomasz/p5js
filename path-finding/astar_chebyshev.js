class AstarChebyshev extends AstarBase {
    constructor() {
        super();
        //chebyshev heuristic
        this.heuristic = function(a, b) {

            var dx = Math.abs(a.x - b.x);
            var dy = Math.abs(a.y - b.y);
            return Math.max(dx, dy);
        }
    }
};

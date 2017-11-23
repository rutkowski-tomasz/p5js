class AstarOctile extends AstarBase {
    constructor() {
        super();
        //octile heuristic
        this.heuristic = function(a, b) {
            var dx = Math.abs(a.x - b.x);
            var dy = Math.abs(a.y - b.y);

            return (dx + dy) + ((Math.sqrt(2) - 2) * Math.min(dx, dy));
        }
    }
};

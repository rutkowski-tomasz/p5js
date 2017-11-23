class Dijkstra extends AstarBase {
    constructor() {
        super();
        //no heuristic
        this.heuristic = function(a, b) {
            return 0;
        }
    }
};

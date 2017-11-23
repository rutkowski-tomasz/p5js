function euclidianHeuristic(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function manhattanHeuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function chebyshevHeuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) - Math.min((a.x - b.x), (a.y - b.y));
}

function octileHeuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + (1 - Math.sqrt(2)) * Math.min((a.x - b.x), (a.y - b.y));
}

function dijkstraHeuristic(a, b) {
    /*https://github.com/qiao/PathFinding.js/blob/master/src/finders/DijkstraFinder.js ¯\_(ツ)_/¯
    w sumie trochę prawdy, skoro dijkstra to astar bez heury
    */
    return 0;
}
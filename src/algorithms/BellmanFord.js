export function bellmanFord(grid, startNode, finishNode) {
    var distance = Array.from(Array(grid.length), () => new Array(grid[0].length).fill(Infinity));
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;
    distance[startNode.row][startNode.col] = 0;
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            if (distance[closestNode.row][closestNode.col] + 1 < distance[neighbor.row][neighbor.col]) {
                distance[neighbor.row][neighbor.col] = distance[closestNode.row][closestNode.col] + 1;
                neighbor.distance = distance[neighbor.row][neighbor.col];
                neighbor.previousNode = closestNode;
            }
        }
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
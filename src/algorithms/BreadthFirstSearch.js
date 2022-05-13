
export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.isVisited = true;
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByVisited(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        // ----------------------------
        const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            if (neighbor.isVisited === false) {
                neighbor.isVisited = true;
                neighbor.previousNode = closestNode;
            }
        }
    }

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

function sortNodesByVisited(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => Number(nodeB.isVisited) - Number(nodeA.isVisited));
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
export function aStar(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    startNode.f = 0;
    startNode.s = 0;
    const openList = getAllNodes(grid);
    while (!!openList.length) {
        sortNodesByFinal(openList);
        const currentNode = openList.shift();

        if (currentNode.f === Infinity) return visitedNodesInOrder;

        if (currentNode.isWall) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) return visitedNodesInOrder;

        // ----------------------------
        var neighbors = getNeighbors(currentNode, grid);
        for (var neighbor of neighbors) {
            let path = currentNode.s + 1;
            if (path < neighbor.score) {
                neighbor.s = path;
                neighbor.previousNode = currentNode;
                neighbor.h = Heuristic(neighbor, endNode);
                neighbor.f = path + neighbor.h;
            }
        }
        console.log(neighbors);
    }
}

function sortNodesByFinal(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => { return nodeA.f - nodeB.f } );
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

function Heuristic(node1, node2) {
    let d1 = Math.abs(node1.row - node2.row);
    let d2 = Math.abs(node1.col - node2.col);
    return d1 + d2;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getNodesShortestPathAstar(endNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}


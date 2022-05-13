export function generateMaze(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.isVisited = true;
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByVisited(unvisitedNodes);
        const closestNode = unvisitedNodes.pop();
        if ( closestNode.isWall ||
            (closestNode.row === startNode.row && closestNode.col === startNode.col) ||
            (closestNode.row === finishNode.row && closestNode.col === finishNode.col)) continue;

        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        // ----------------------------
        const neighbors = getUnvisitedNeighbors(closestNode, grid);
        let rand = getRandom(0, neighbors.length);
        for (let i = 0; i < neighbors.length; i++) {
            if (i === rand) continue;
            else {
                if (neighbors[i].isVisited === false) {
                    neighbors[i].isVisited = true;
                    neighbors[i].previousNode = closestNode;
                    neighbors[i].isWall = true;
                }
            }
        }
    }
}

export function generateRecursive(grid, startNode, finishNode) {
    startNode.isVisited = true;
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        const closestNode = unvisitedNodes.pop();
        if (closestNode.isWall) continue;
        closestNode.isVisited = true;
        
        const neighbors = getUnvisitedNeighbors(closestNode, grid);
        let rand = getRandom(0, 3);
        for (let i = 0; i < neighbors.length; i++) {
            if (i === rand) continue;
            else {
                if (!neighbors[i].isVisited && !neighbors[i].isWall) {
                    if ((neighbors[i].row === startNode.row && neighbors[i].col === startNode.col) ||
                        (neighbors[i].row === finishNode.row && neighbors[i].col === finishNode.col)) continue;
                    else {
                        neighbors[i].isVisited = true;
                        neighbors[i].previousNode = closestNode;
                        neighbors[i].isWall = getRandom(0, 3) < 2 ? true : false;
                    }
                    
                }
            }
        }
    }
}

function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    unvisitedNodes.sort((nodeA, nodeB) => Number(nodeA.isVisited) - Number(nodeB.isVisited));
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
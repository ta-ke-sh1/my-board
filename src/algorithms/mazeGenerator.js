import { aStar } from './Astar'
import { getNodesShortestPath } from './algorithms/Dijkstra';

export function generateMaze(grid, startNode, endNode) {
    aStar(grid, startNode, endNode);
    let shortestPath = getNodesShortestPath(endNode);

    for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 51; col++) {
            let chance = Math.floor(Math.random() * 10) + 1 < 4 ? true : false;
            if (grid[row][col] in shortestPath) {
                continue;
            }
            else if (!chance) {
                continue;
            }
            else {
                grid[row][col].isWall = true;
                document.getElementById(`node-${row}-${col}`).className = 'node node-wall';
            }
        }
    }
}
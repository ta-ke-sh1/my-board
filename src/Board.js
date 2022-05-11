import React from 'react';
import './Styles/board.css';
// import { dijkstra, getNodesShortestPath } from './algorithms/Dijkstra';
import { aStar, getNodesShortestPathAstar } from './algorithms/Astar';
import Nav from './components/controlBar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class Tile extends React.Component {
    render() {
        const {
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
        } = this.props;

        const extraClassName = isFinish
            ? 'node-finish'
            : isStart
                ? 'node-start'
                : isWall
                    ? 'node-wall'
                    : '';
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
            ></div>
        )
    }
}

class Board extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            alg: 'djikstra',
            selectStart: false,
            selectEnd: false,
            setWall: false
        }
        this.handleAlgorithm = this.handleAlgorithm.bind(this)
    }

    handleAlgorithm() {
        this.visualizeDijkstra();
    }

    clearBoard() {
        let { grid } = this.state;
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 52; col++) {
                if (grid[row][col].isStart) {
                    document.getElementById(`node-${row}-${col}`).className =
                        'node node-start';
                }
                else if (grid[row][col].isFinish) {
                    document.getElementById(`node-${row}-${col}`).className =
                        'node node-finish';
                }
                else {
                    document.getElementById(`node-${row}-${col}`).className =
                        'node';
                }
            }
        }
        grid = getInitialGrid();
        this.setState({ grid });
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const vistitedNodesInOrder = aStar(grid, startNode, endNode);
        const nodeShortestPath = getNodesShortestPathAstar(endNode);
        this.animateDijkstra(vistitedNodesInOrder, nodeShortestPath);
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    createBoard(grid) {
        return (
            <div className='Board'>
                {grid.map((row, rowIndex) => {
                    return (
                        <div className='Row' key={rowIndex}>
                            {
                                row.map((node, nodeIndex) => {
                                    const { row, col, isFinish, isStart, isWall } = node;
                                    return (
                                        <Tile
                                            key={nodeIndex}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}
                                        />
                                    );
                                })}
                        </div>
                    );
                })}
            </div>
        )
    }

    render() {
        const { grid } = this.state
        return (
            <div className='container' id='container'>
                <Nav.ControlBar
                    handleAlgorithm={() => this.handleAlgorithm()}
                    clearBoard={() => this.clearBoard()}
                />
                {this.createBoard(grid)}
            </div>
        )
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 25; row++) {
        const currentRow = [];
        for (let col = 0; col < 52; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,  // Djikstra
        isVisited: false,
        isWall: false,
        s: Infinity,         // A-Star 
        f: Infinity,         // Sum of score and heuristic
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const ExportModules = { Board };
export default ExportModules;
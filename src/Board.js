import React from 'react';
import './Styles/board.css';
import { dijkstra, getNodesShortestPath } from './algorithms/Dijkstra';
import { aStar } from './algorithms/Astar';
import Nav from './components/controlBar';

var START_NODE_ROW = 11;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 11;
var FINISH_NODE_COL = 32;

const ROW_COUNT = 25;
const COL_COUNT = 51;

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
            alg: 'aStar',
            selectStart: false,
            selectEnd: false,
            setWall: false
        }
        this.handleAlgorithm = this.handleAlgorithm.bind(this)
        this.selectAlgorithm = this.selectAlgorithm.bind(this)
    }

    handleAlgorithm() {
        this.visualizeAlgorithm();
    }

    clearBoard() {
        let { grid } = this.state;
        for (let row = 0; row < ROW_COUNT; row++) {
            for (let col = 0; col < COL_COUNT; col++) {
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

    refreshBoard() {
        let { grid } = this.state;
        let walls = [];
        for (let row = 0; row < ROW_COUNT; row++) {
            for (let col = 0; col < COL_COUNT; col++) {
                if (grid[row][col].isWall) {
                    walls.push([row, col]);
                }
                else if (grid[row][col].isStart || grid[row][col].isFinish) {
                    continue
                }
                else {
                    document.getElementById(`node-${row}-${col}`).className =
                        'node';
                }
            }
        }
        grid = getInitialGrid();
        for (let i = 0; i < walls.length; i++){
            document.getElementById(`node-${walls[i][0]}-${walls[i][1]}`).className =
                'node node-wall';
            let row = walls[i][0]
            let col = walls[i][1]
            grid[row][col].isWall = true;
        }
        this.setState({ grid });
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        if (!this.state.selectStart && !this.state.selectEnd) {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }

        else if (!this.state.selectEnd) { // select start
            let oldRow = START_NODE_ROW;
            let oldCol = START_NODE_COL;
            let { grid } = this.state;

            // clear old finish node
            grid[oldRow][oldCol].isStart = false;
            document.getElementById(`node-${oldRow}-${oldCol}`).className =
                'node';
            // assign new start node
            grid[row][col].isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
                'node node-start';
            START_NODE_ROW = row;
            START_NODE_COL = col;
            this.setState({ grid, selectStart: false });
        }

        else if (!this.state.selectStart) {
            let oldRow = FINISH_NODE_ROW;
            let oldCol = FINISH_NODE_COL;
            let { grid } = this.state;

            //
            grid[oldRow][oldCol].isFinish = false;
            document.getElementById(`node-${oldRow}-${oldCol}`).className =
                'node';
            //
            grid[row][col].isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
                'node node-finish';
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            this.setState({ grid, selectEnd: false });
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    async selectStart() {
        if (this.state.selectEnd) {
            this.setState({ selectEnd: false })
        }
        await this.setState({ selectStart: true })
    }

    async selectEnd() {
        if (this.state.selectStart) {
            this.setState({ selectStart: false })
        }
        await this.setState({ selectEnd: true })
    }

    async selectAlgorithm(event) {
        await this.setState({ alg: event.target.value })
    }

    visualizeAlgorithm() {
        this.refreshBoard();
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const alg = this.state.alg;
        let vistitedNodesInOrder = [];
        let nodeShortestPath = [];
        if (alg === 'djikstra') {
            vistitedNodesInOrder = dijkstra(grid, startNode, endNode);
            nodeShortestPath = getNodesShortestPath(endNode);
            console.log(endNode.previousNode);
        }
        else if (alg === 'aStar') {
            vistitedNodesInOrder = aStar(grid, startNode, endNode);
            nodeShortestPath = getNodesShortestPath(endNode);
            console.log(endNode.previousNode);
        }
        else {
            console.log('Awaiting implementation!');
            return;
        }
        this.animateAlgorithm(vistitedNodesInOrder, nodeShortestPath);
    }

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
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
                    selectStart={() => this.selectStart()}
                    selectEnd={() => this.selectEnd()}
                    selectAlgorithm={(event) => this.selectAlgorithm(event)}
                />
                {this.createBoard(grid)}
            </div>
        )
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < ROW_COUNT; row++) {
        const currentRow = [];
        for (let col = 0; col < COL_COUNT; col++) {
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
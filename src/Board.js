import React from "react";
import "./Styles/board.css";
import { dijkstra, getNodesShortestPath } from "./algorithms/Dijkstra";
import { aStar } from "./algorithms/Astar";
import { bfs } from "./algorithms/BreadthFirstSearch";
import { bellmanFord } from "./algorithms/BellmanFord";
import Nav from "./components/controlBar";

var START_NODE_ROW = 11;
var START_NODE_COL = 12;
var FINISH_NODE_ROW = 11;
var FINISH_NODE_COL = 42;

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
            handleDrag,
        } = this.props;

        const extraClassName = isFinish
            ? "node-finish"
            : isStart
            ? "node-start"
            : isWall
            ? "node-wall"
            : "";
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
                onDrag={() => handleDrag(row, col)}
            ></div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            alg: "aStar",
            selectStart: false,
            selectEnd: false,
            setWall: false,
            startDrag: false,
            finishDrag: false,
            complexity: 35,
        };
        this.handleAlgorithm = this.handleAlgorithm.bind(this);
        this.selectAlgorithm = this.selectAlgorithm.bind(this);
        this.selectComplexity = this.selectComplexity.bind(this);
    }

    /// ------------------------------ Handling events ------------------------------
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        let { grid } = this.state;
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            this.setState({
                selectStart: true,
                selectEnd: false,
                startDrag: true,
            });
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            this.setState({
                selectEnd: true,
                selectStart: false,
                finishDrag: true,
            });
        } else if (!this.state.selectStart && !this.state.selectEnd) {
            const newGrid = getNewGridWithWallToggled(
                this.state.grid,
                row,
                col
            );
            this.setState({ grid: newGrid, mouseIsPressed: true });
        } else if (!this.state.selectEnd) {
            changeStartNode(row, col, grid);
            this.setState({ grid, selectStart: false, selectEnd: false });
        } else if (!this.state.selectStart) {
            changeFinishNode(row, col, grid);
            this.setState({ grid, selectEnd: false, selectStart: false });
        }
    }

    handleMouseEnter(row, col) {
        let { grid } = this.state;
        if (this.state.startDrag) {
            changeStartNode(row, col, grid);
            this.setState({ selectStart: false });
        }

        if (this.state.finishDrag) {
            changeFinishNode(row, col, grid);
            this.setState({ selectEnd: false });
        }

        if (!this.state.mouseIsPressed) return;
        else {
            if (!this.state.selectStart && !this.state.selectEnd) {
                const newGrid = getNewGridWithWallToggled(
                    this.state.grid,
                    row,
                    col
                );
                this.setState({ grid: newGrid, mouseIsPressed: true });
            } else if (!this.state.selectEnd) {
                // select start
                changeStartNode(row, col, grid);
            } else if (!this.state.selectStart) {
                changeFinishNode(row, col, grid);
            }
        }
    }

    handleMouseUp() {
        this.setState({
            mouseIsPressed: false,
            startDrag: false,
            finishDrag: false,
        });
    }

    handleDrag(row, col) {
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            this.setState({ startDrag: true, finishDrag: false });
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            this.setState({ finishDrag: true, startDrag: false });
        }
    }

    async selectComplexity(event) {
        let type = event.target.value;
        let complexity = 0;
        if (type === "low") complexity = 35;
        else if (type === "medium") complexity = 40;
        else complexity = 45;
        await this.setState({ complexity: complexity });
    }

    async selectAlgorithm(event) {
        await this.setState({ alg: event.target.value });
    }
    /// ------------------------------ Handling events ------------------------------

    handleAlgorithm() {
        this.visualizeAlgorithm();
    }

    clearBoard() {
        let { grid } = this.state;
        for (let row = 0; row < ROW_COUNT; row++) {
            for (let col = 0; col < COL_COUNT; col++) {
                grid[row][col].isVisited = false;
                if (grid[row][col].isStart) {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-start";
                } else if (grid[row][col].isFinish) {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-finish";
                } else {
                    if (grid[row][col].isWall) {
                        grid[row][col].isWall = false;
                    }
                    document.getElementById(`node-${row}-${col}`).className =
                        "node";
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
                grid[row][col].isVisited = false;
                if (grid[row][col].isWall) {
                    walls.push([row, col]);
                } else if (grid[row][col].isStart || grid[row][col].isFinish) {
                    continue;
                } else {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node";
                }
            }
        }
        grid = getInitialGrid();
        for (let i = 0; i < walls.length; i++) {
            document.getElementById(
                `node-${walls[i][0]}-${walls[i][1]}`
            ).className = "node node-wall";
            let row = walls[i][0];
            let col = walls[i][1];
            grid[row][col].isWall = true;
        }
        this.setState({ grid });
    }

    generateMaze() {
        this.clearBoard();
        const { grid } = this.state;

        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 51; col++) {
                grid[row][col].isVisited = false;
                let chance =
                    Math.floor(Math.random() * 100) + 10 < this.state.complexity
                        ? true
                        : false;
                if (
                    (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) ||
                    (row === START_NODE_ROW && col === START_NODE_COL)
                ) {
                    continue;
                } else if (!chance) {
                    continue;
                } else {
                    grid[row][col].isWall = true;
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-wall";
                }
            }
        }

        this.setState({ grid });
    }

    visualizeAlgorithm() {
        this.refreshBoard();
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const alg = this.state.alg;
        let vistitedNodes = [];
        let shortestPath = [];
        if (alg === "djikstra")
            vistitedNodes = dijkstra(grid, startNode, endNode);
        else if (alg === "aStar")
            vistitedNodes = aStar(grid, startNode, endNode);
        else if (alg === "bfs") vistitedNodes = bfs(grid, startNode, endNode);
        else if (alg === "bellmanFord")
            vistitedNodes = bellmanFord(grid, startNode, endNode);
        else {
            console.log("Awaiting implementation!");
            return;
        }
        shortestPath = getNodesShortestPath(endNode);
        this.animateAlgorithm(vistitedNodes, shortestPath);
    }

    animateAlgorithm(visitedNodes, shortestPath) {
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestPath);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodes[i];

                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = "node node-visited";
            }, 10 * i);
        }
    }

    animateShortestPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = "node node-shortest-path";
            }, 40 * i);
        }
    }

    createBoard(grid) {
        return (
            <div className="Board">
                {grid.map((row, rowIndex) => {
                    return (
                        <div className="Row" key={rowIndex}>
                            {row.map((node, nodeIndex) => {
                                const { row, col, isFinish, isStart, isWall } =
                                    node;
                                return (
                                    <Tile
                                        key={nodeIndex}
                                        col={col}
                                        row={row}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        onMouseDown={(row, col) =>
                                            this.handleMouseDown(row, col)
                                        }
                                        onMouseEnter={(row, col) =>
                                            this.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}
                                        handleDrag={(row, col) =>
                                            this.handleDrag(row, col)
                                        }
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { grid } = this.state;
        return (
            <div className="container" id="container">
                <Nav.ControlBar
                    handleAlgorithm={() => this.handleAlgorithm()}
                    clearBoard={() => this.clearBoard()}
                    selectAlgorithm={(event) => this.selectAlgorithm(event)}
                    selectComplexity={(event) => this.selectComplexity(event)}
                    generateMaze={() => this.generateMaze()}
                />
                {this.createBoard(grid)}
            </div>
        );
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
        distance: Infinity, // Djikstra
        isVisited: false,
        isWall: false,
        s: Infinity, // A-Star
        f: Infinity, // Sum of score and heuristic
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

function changeStartNode(row, col, grid) {
    let oldRow = START_NODE_ROW;
    let oldCol = START_NODE_COL;
    // clear old finish node
    grid[oldRow][oldCol].isStart = false;
    document.getElementById(`node-${oldRow}-${oldCol}`).className = "node";
    // assign new start node
    grid[row][col].isStart = true;
    document.getElementById(`node-${row}-${col}`).className = "node node-start";
    START_NODE_ROW = row;
    START_NODE_COL = col;
}

function changeFinishNode(row, col, grid) {
    let oldRow = FINISH_NODE_ROW;
    let oldCol = FINISH_NODE_COL;
    //
    grid[oldRow][oldCol].isFinish = false;
    document.getElementById(`node-${oldRow}-${oldCol}`).className = "node";
    //
    grid[row][col].isFinish = true;
    document.getElementById(`node-${row}-${col}`).className =
        "node node-finish";
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
}

const ExportModules = { Board };
export default ExportModules;

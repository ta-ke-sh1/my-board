import React from "react";
import "./Styles/board.css";
// import { dijkstra, getNodesShortestPath } from './algorithms/Dijkstra';
import { aStar, getNodesShortestPathAstar } from "./algorithms/Astar";
import navigation from "./components/controlBar";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class Node extends React.Component {
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
            alg: "djikstra",
        };
        this.handleAlgorithm = this.handleAlgorithm.bind(this);
    }

    handleAlgorithm() {
        this.visualizeAlgorithm();
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

    clearBoard() {
        console.log("Clear Board");
        const { grid } = this.state;
        for (let row = 0; row < 30; row++) {
            for (let col = 0; col < 50; col++) {
                if (grid[row][col].isWall) {
                    grid[row][col].isWall = !grid[row][col].isWall;
                }

                if (row === START_NODE_ROW && col === START_NODE_COL) {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-start";
                } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-finish";
                } else {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node";
                }
            }
        }
        this.state.grid = getInitialGrid;
        this.setState({ grid });
    }

    selectStart() {
        console.log("Select Start");
    }

    selectEnd() {
        console.log("Select End");
    }

    setWall() {
        console.log("Set Wall");
    }

    visualizeAlgorithm() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const vistitedNodesInOrder = aStar(grid, startNode, endNode);
        const nodeShortestPath = getNodesShortestPathAstar(endNode);
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
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = "node node-visited";
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = "node node-shortest-path";
            }, 50 * i);
        }
    }

    render() {
        const { grid } = this.state;
        return (
            <>
                <navigation.ControlBar
                    handleAlgorithm={() => {
                        this.handleAlgorithm();
                    }}
                    clearBoard={() => {
                        this.clearBoard();
                    }}
                    selectStart={() => {
                        this.selectStart();
                    }}
                    selectEnd={() => {
                        this.selectEnd();
                    }}
                    setWall={() => {
                        this.setWall();
                    }}
                />
                <div className="container" id="container">
                    <div className="Board">
                        {grid.map((row, rowIndex) => {
                            return (
                                <div className="Row" key={rowIndex}>
                                    {row.map((node, nodeIndex) => {
                                        const {
                                            row,
                                            col,
                                            isFinish,
                                            isStart,
                                            isWall,
                                        } = node;
                                        return (
                                            <Node
                                                key={nodeIndex}
                                                col={col}
                                                isFinish={isFinish}
                                                isStart={isStart}
                                                isWall={isWall}
                                                onMouseDown={(row, col) =>
                                                    this.handleMouseDown(
                                                        row,
                                                        col
                                                    )
                                                }
                                                onMouseEnter={(row, col) =>
                                                    this.handleMouseEnter(
                                                        row,
                                                        col
                                                    )
                                                }
                                                onMouseUp={() =>
                                                    this.handleMouseUp()
                                                }
                                                row={row}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 30; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
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
        distance: Infinity,
        priorities: Infinity,
        isVisited: false,
        isWall: false,
        s: Infinity, // A-Star
        h: Infinity, // Heuristic Score
        f: Infinity, // Sum of score and heuristic
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const ExportModules = { Board };
export default ExportModules;

import React from "react";
import "./../Styles/navigation.css";

class ControlBar extends React.Component {
    render() {
        const { handleAlgorithm, clearBoard, selectAlgorithm, generateMaze, selectComplexity } =
            this.props;
        return (
            <div className="navigation-bar">
                <div className="disabled" id="app-name">
                    Pathfinder
                </div>
                <div className="disabled">
                    Select an Algorithm:
                </div>
                <select name="" id="" className="btn" onChange={event => selectAlgorithm(event)}>
                    <option value="aStar">A-Star</option>
                    <option value="djikstra">Djikstra</option>
                    <option value="bellmanFord">Bellman-Ford</option>
                    <option value="bfs">Bread First Search</option>
                </select>
                <div className="disabled">
                    Select Maze Complexity:
                </div>
                <select name="" id="" className="btn" onChange={event => selectComplexity(event)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <div className="btn" onMouseDown={() => generateMaze()}>
                    Generate Maze
                </div>
                <div className="right">
                    <div className="disabled">
                        Options:
                    </div>
                    <div className="btn" onMouseDown={() => clearBoard()}>
                        Clear Board
                    </div>
                    <div className="btn" onMouseDown={() => handleAlgorithm()} id='visualize' >
                        Visualize it!
                    </div>
                </div>
            </div>
        );
    }
}

const ExportModules = { ControlBar };
export default ExportModules;

import React from "react";
import "./../Styles/navigation.css";

class ControlBar extends React.Component {
    render() {
        const { handleAlgorithm, clearBoard, selectAlgorithm } =
            this.props;
        return (
            <div className="navigation-bar">
                
                <div className="disabled">
                    Choose an operation:
                </div>
                <div className="btn" onMouseDown={() => clearBoard()}>
                    Clear Board
                </div>
                <div className="disabled">
                    Select an Algorithm: 
                </div>
                <select name="" id="" className="btn" onChange={event => selectAlgorithm(event)}>
                    <option value="aStar">A-Star</option>
                    <option value="djikstra">Djikstra</option>
                    <option value="bellmanFord">Bellman-Ford</option>
                    <option value="bfs">Bread First Search</option>
                    <option value="dfs">Depth First Search</option>
                </select>
                <div className="btn" onMouseDown={() => handleAlgorithm()} id='visualize' >
                    Visualize it!
                </div>
            </div>
        );
    }
}

const ExportModules = { ControlBar };
export default ExportModules;

import React from "react";
import "./../Styles/navigation.css";

class ControlBar extends React.Component {
    render() {
        const { handleAlgorithm, clearBoard, selectStart, selectEnd, setWall } =
            this.props;
        return (
            <div className="navigation-bar">
                <div className="btn" onMouseDown={() => handleAlgorithm()}>
                    Visualize
                </div>
                <div className="btn" onMouseDown={() => clearBoard()}>
                    Clear Board
                </div>
                <div className="btn" onMouseDown={() => selectStart()}>
                    Select Start
                </div>
                <div className="btn" onMouseDown={() => selectEnd()}>
                    Select End
                </div>
                <div className="btn" onMouseDown={() => setWall()}>
                    Set Wall
                </div>
            </div>
        );
    }
}

const ExportModules = { ControlBar };
export default ExportModules;

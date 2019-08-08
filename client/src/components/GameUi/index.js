import "./style.css";
import PropTypes from "prop-types";
import React from "react";

const calcHpBarWidth = (controlledUnit) => {
    const width = (controlledUnit.state.hp / controlledUnit.stats.maxHp) * 100;
    return width <= 0 ? 0 : Math.floor(width);
};

class GameUi extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        const { messageBoxes, controlledUnit } = this.props;

        return <div className="game-ui">
            {
                messageBoxes.map((messageBox) => (
                    <div
                        key={JSON.stringify(messageBox)}
                        className="message-box"
                        style={{ top: messageBox.uPoint.y + "px", left: messageBox.uPoint.x + "px"}}
                    >
                        {messageBox.message}
                    </div>
                ))
            }
            {
                controlledUnit &&
                    <div className="bar">
                        <div className="bar__value" style={{ width: calcHpBarWidth(controlledUnit) + "%" }} />
                    </div>
            }
        </div>;
    };
}

GameUi.propTypes = {
    messageBoxes: PropTypes.array,
    controlledUnit: PropTypes.object,
};

GameUi.defaultProps = {
    messageBoxes: [],
    controlledUnit: null,
};

export default GameUi;

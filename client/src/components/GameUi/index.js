import "./style.css";
import PropTypes from "prop-types";
import React from "react";
import HpBarBig from "./HpBarBig";
import GameTime from "./GameTime";

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
        const { messageBoxes, controlledUnit, targetUnit, time } = this.props;

        return <div className="game-ui">
            <div className="message-panel">
                {
                    messageBoxes.map((messageBox) => (
                        <div
                            key={Math.random()}
                            className="message-panel__message"
                        >
                            <span className="message-panel__unit">[{messageBox.unit.name}]</span>: {messageBox.message}
                        </div>
                    ))
                }
            </div>
            {
                controlledUnit &&
                <HpBarBig
                    width={calcHpBarWidth(controlledUnit)}
                    label={`${controlledUnit.name}: ${controlledUnit.state.hp}/${controlledUnit.stats.maxHp}`}
                />
            }
            {
                targetUnit &&
                <HpBarBig
                    width={calcHpBarWidth(targetUnit)}
                    label={`${targetUnit.name}: ${targetUnit.state.hp}/${targetUnit.stats.maxHp}`}
                    theme="target"
                />
            }
            {
                time &&
                <GameTime time={time} />
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

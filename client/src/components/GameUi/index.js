import "./style.css";
import PropTypes from "prop-types";
import React from "react";

class GameUi extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        const { messageBoxes } = this.props;

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
        </div>;
    };
}

GameUi.propTypes = {
    messageBoxes: PropTypes.array,
};

GameUi.defaultProps = {
    messageBoxes: [],
};

export default GameUi;

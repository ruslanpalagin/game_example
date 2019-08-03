import React from 'react';
import qs from "qs";
import Game2D from "./game2d/Game2D";
import Login from "src/components/Login";
import GameUi from "src/components/GameUi";

const VERSION = "0.0.8";
console.log("Client v: " + VERSION);
const game = new Game2D({ version: VERSION });

class App extends React.Component {
    constructor(props) {
        super(props);

        const options = qs.parse(window.location.search.replace("?", ""));
        options.accountId = parseInt(options.accountId, 10) || 1;
        options.addPing = parseInt(options.addPing, 10) || 0;
        options.serverName = options.serverName || "local";
        options.elId = "game__main-frame";

        this.state = {
            options,
            isGameInitialized: false,
            uiState: {},
        };
    }

    setOption = (name, value) => {
        const { options } = this.state;
        const newOptions = Object.assign({}, options, {[name]: value});
        this.setState({
            options: newOptions,
        });
    };

    initGame = () => {
        const { options } = this.state;
        game.init(options);
        game.on("uiStateAction", this.handleUiStateAction);
        this.setState({
            isGameInitialized: true,
        });
    };

    handleUiStateAction = (action) => {
        if (action.name === "say") {
            this.setState(({uiState}) => {
                uiState.messageBoxes = uiState.messageBoxes || [];
                uiState.messageBoxes.push(action);
                return { uiState };
            });
            setTimeout(() => {
                this.setState(({uiState}) => {
                    uiState.messageBoxes = uiState.messageBoxes || [];
                    uiState.messageBoxes.splice(uiState.messageBoxes.indexOf(action), 1);
                    return { uiState };
                });
            }, 4000);
        }
    };

    render = () => {
        const { options, isGameInitialized, uiState } = this.state;

        return (
            <div className="">
                <div className="game__main-frame" id="game__main-frame" />
                {
                    isGameInitialized
                        ? <GameUi {...uiState} />
                        : <Login options={options} onChangeOption={this.setOption} onInitGameClick={this.initGame} />
                }
            </div>
        );
    };
}

export default App;

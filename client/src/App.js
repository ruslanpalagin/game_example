import React from 'react';
import Game2D from "./game2d/Game2D";
import qs from "qs";

const VERSION = "0.0.7";
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
        this.setState({
            isGameInitialized: true,
        });
    };

    render = () => {
        const { options, isGameInitialized } = this.state;

        return (
            <div className="">
                <div className="game__main-frame" id="game__main-frame" />
                {
                    !isGameInitialized &&
                    <div>
                        <h1>Time Lancer</h1>
                        <div>
                            <label>
                                Account ID:
                                <input
                                    type="text"
                                    onChange={(event) => this.setOption("accountId", parseInt(event.target.value, 10)) }
                                    value={options.accountId}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Server Name:
                                <select
                                    value={options.serverName}
                                    onChange={(event) => this.setOption("serverName", event.target.value) }
                                >
                                    <option value="production">production</option>
                                    <option value="local">local</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Add ping for slow connection emulation:
                                <input
                                    type="text"
                                    onChange={(event) => this.setOption("addPing", parseInt(event.target.value, 10)) }
                                    value={options.addPing}
                                />
                            </label>
                        </div>
                        <div>
                            <button onClick={this.initGame}>Start free trial now</button>
                        </div>
                    </div>
                }
            </div>
        );
    };
}

export default App;

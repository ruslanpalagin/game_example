import React from 'react';
import Game2D from "./game/Game2D";
import qs from "qs";

const game = new Game2D();

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
        console.log("options", options);
        game.init(options); // TODO handle disconnect and back to logic screen
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
                        <h1>Dungeon</h1>
                        <h3>of Might & Flower</h3>
                        <label>
                            Account ID:
                            <input
                                type="text"
                                onChange={(event) => this.setOption("accountId", parseInt(event.target.value, 10)) }
                                value={options.accountId}
                            />
                        </label>
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
                        <label>
                            Add ping:
                            <input
                                type="text"
                                onChange={(event) => this.setOption("addPing", parseInt(event.target.value, 10)) }
                                value={options.addPing}
                            />
                        </label>
                        <button onClick={this.initGame}>Start free trial now</button>
                    </div>
                }
            </div>
        );
    };
}

export default App;

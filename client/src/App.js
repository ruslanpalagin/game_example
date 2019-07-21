import React from 'react';
import Main from "./app/Main";
import qs from "qs";

const main = new Main();

class App extends React.Component {
    componentDidMount = () => {
        const options = qs.parse(window.location.search.replace("?", ""));
        options.accountId = parseInt(options.accountId, 10);
        options.addPing = parseInt(options.addPing, 10);
        console.log("options", options);
        main.init(options);
    };

    render = () => {
        return (
            <div className="">
                <div className="game__main-frame" id="game__main-frame" />
            </div>
        );
    };
}

export default App;

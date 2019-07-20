import React from 'react';
import Main from "./app/Main";

const main = new Main();

class App extends React.Component {
    componentDidMount = () => {
        main.init();
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

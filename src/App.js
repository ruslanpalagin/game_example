import React from 'react';
import './App.css';
import PIXI from "./vendor/PIXI";
import charUrl from "./textures/char.png";

class App extends React.Component {

    componentDidMount = () => {
        const app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        });
        app.renderer.backgroundColor = 0xeeeeee;
        app.renderer.resize(window.innerWidth - 50, window.innerHeight - 50 );
        document.getElementById("game__main-frame").appendChild(app.view);

        PIXI.loader = new PIXI.Loader();
        PIXI.loader
        .add("/textures/char.png")
        .load(() => {
            console.log("charUrl", charUrl);
            console.log("sss",  PIXI.loader.resources[charUrl].texture);
            let cat = new PIXI.Sprite(PIXI.loader.resources[charUrl].texture);

            //Add the cat to the stage
            app.stage.addChild(cat);
        });


    }

    render = () => {
      return (
          <div className="">
            <div className="game__main-frame" id="game__main-frame" />
          </div>
      );
  };
}

export default App;

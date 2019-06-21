import React from 'react';
import './App.css';
import PIXI from "./vendor/PIXI";
import charUrl from "./textures/char.png";
import mountainsUrl from "./textures/mountains.png";
import treesUrl from "./textures/trees.png";

class App extends React.Component {

    componentDidMount = () => {
        const app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: 1       // default: 1
        });
        app.renderer.resize(window.innerWidth - 50, window.innerHeight - 50 );
        document.getElementById("game__main-frame").appendChild(app.view);

        PIXI.loader = new PIXI.Loader();
        PIXI.loader
        .add(charUrl)
        .add(mountainsUrl)
        .add(treesUrl)
        .load(() => {
            let cat = new PIXI.Sprite(PIXI.loader.resources[charUrl].texture);
            app.stage.addChild(cat);
            let m = new PIXI.Sprite(PIXI.loader.resources[mountainsUrl].texture);
            m.position.y = 100;
            app.stage.addChild(m);
            let t = new PIXI.Sprite(PIXI.loader.resources[treesUrl].texture);
            t.position.x = 100;
            app.stage.addChild(t);
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

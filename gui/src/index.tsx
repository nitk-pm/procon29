import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Game from "./components/Game";
import * as IgoKabaddi from "./modules/igokabaddi";

console.log(require('../example/example.json'));

ReactDOM.render(
	<Game.Game board={new IgoKabaddi.Board(require('../example/example.json'))} turn={IgoKabaddi.Turn.Red}/>,
	document.getElementById("container")
);

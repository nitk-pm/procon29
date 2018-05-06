import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import Game from "./container/game";
import * as IgoKabaddi from "./logic/igokabaddi";
import * as Reducer from './store';

ReactDOM.render(
	<Provider store={Reducer.store}>
		<Game />
	</Provider>,
	document.getElementById("root")
);

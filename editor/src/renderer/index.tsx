import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import * as Reducer from './reducer';

ReactDOM.render(
	<Provider store={Reducer.store}>
		<div></div>
	</Provider>,
	document.getElementById("root")
);

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as Redux from 'redux';
import * as Reducer from './reducer';
import AppContainer from './container/app';

ReactDOM.render(
	<Provider store={Reducer.store}>
		<AppContainer />
	</Provider>,
	document.getElementById("root")
);

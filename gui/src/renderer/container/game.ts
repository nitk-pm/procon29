import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';

import * as GameModule from '../module/game';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	done () {
		return this.dispatch(GameModule.done());
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		inDialog: state.inDialog,
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);

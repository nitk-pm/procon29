import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';

import * as GameModule from '../module/game';
import * as ServerModule from '../module/server';
import * as ServerSaga from '../saga/server';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	done () {
		return this.dispatch({type: GameModule.ActionNames.DONE});
	}

	applyConfig(config: Store.Config) {
		
	}

	changeIp(ip: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_IP_ADDRESS, payload: {ip}});
	}

	changePort(port: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_PORT, payload: {port}});
	}

	connectAsPlayer() {
		this.dispatch({type: ServerSaga.ActionNames.CONNECT_SOCKET});
	}


	connectAsUser() {
		this.dispatch({type: ServerSaga.ActionNames.CONNECT_SOCKET});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		inDialog: state.server.socket == null,
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';
import * as Common from '../../common';

import * as GameModule from '../module/game';
import * as ServerModule from '../module/server';
import * as ServerSaga from '../saga/server';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	done () {
		return this.dispatch({type: ServerSaga.ActionNames.PUSH_OP});
	}

	applyConfig(config: Store.Config) {
		
	}

	changeIp(ip: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_IP_ADDRESS, payload: {ip}});
	}

	changePort(port: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_PORT, payload: {port}});
	}

	connectAsPlayer(color: Common.Color) {
		this.dispatch({
			type: ServerSaga.ActionNames.CONNECT_SOCKET,
			payload: {
				config: Store.Config.Player,
				color
			}
		});
	}


	connectAsUser(color: Common.Color) {
		this.dispatch({
			type: ServerSaga.ActionNames.CONNECT_SOCKET,
			payload: {
				config: Store.Config.Player,
				color
			}
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		inDialog: state.server.socket == null,
		connectError: state.connectError,
		freeze: state.freeze,
		time: state.time
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);

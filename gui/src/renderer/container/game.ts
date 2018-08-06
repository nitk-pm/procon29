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
				state: Store.UIState.Player,
				color
			}
		});
	}


	connectAsUser(color: Common.Color) {
		this.dispatch({
			type: ServerSaga.ActionNames.CONNECT_SOCKET,
			payload: {
				state: Store.UIState.Player,
				color
			}
		});
	}

	loadBoard(e: any) {
		const reader = new FileReader();
		const path = e.target.files[0];
		console.log(e.target.files);
		reader.onload = (e) => {
			this.dispatch({
				type: GameModule.ActionNames.LOAD_BOARD,
				payload: {
					board: Common.loadBoard(JSON.parse(e.target.result))
				}
			});
		};
		reader.readAsText(path);
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		inDialog: state.server.socket == null,
		freeze: state.freeze,
		time: state.time,
		viewBoard: state.viewBoard,
		board: state.board,
		server: state.server
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);

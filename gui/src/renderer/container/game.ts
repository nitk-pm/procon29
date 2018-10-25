import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';
import * as Common from '../../common';

import * as GameModule from '../module/game';
import * as AppModule from '../module/app';
import * as ServerModule from '../module/server';
import * as ServerSaga from '../saga/server';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	done (force: boolean) {
		return this.dispatch({
			type: ServerSaga.ActionNames.PUSH_OP,
			payload: {
				force
			}
		});
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
				state: Store.UIState.User,
				color
			}
		});
	}

	loadBoard(e: any) {
		const reader = new FileReader();
		const path = e.target.files[0];
		console.log(e.target.files);
		reader.onload = (e: any) => {
			this.dispatch({
				type: AppModule.ActionNames.UPDATE_BOARD,
				payload: {
					board: Common.loadBoard(JSON.parse(e.target.result))
				}
			});
			this.dispatch({
				type: AppModule.ActionNames.TRANSITION,
				payload: {
					state: Store.UIState.Viewer,
					color: Common.Color.Neut
				}
			});
		};
		reader.readAsText(path);
	}

	changeDir(dir: string) {
		console.log(dir);
		this.dispatch({
			type: AppModule.ActionNames.CHANGE_DIR,
			payload: {
				dir
			}
		});
	}

	swapSuit() {
		this.dispatch({
			type: AppModule.ActionNames.SWAP_SUIT
		});
	}

	ignoreSolver() {
		this.dispatch({
			type: ServerSaga.ActionNames.IGNORE_SOLVER
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		state: state.state,
		freeze: state.freeze,
		time: state.time,
		board: state.board,
		server: state.server,
		dir: state.dir,
		colorMap: state.colorMap,
		rivalOps: state.rivalOps,
		turn: state.turn,
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);

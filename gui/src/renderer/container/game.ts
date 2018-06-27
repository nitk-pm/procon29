import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';

import * as GameModule from '../module/game';
import * as IpModule from '../module/ip';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	done () {
		return this.dispatch({type: GameModule.ActionNames.DONE});
	}

	applyConfig(config: Store.Config) {
		
	}

	changeIp(ip: string) {
		this.dispatch({type: IpModule.ActionNames.CHANGE_IP_ADDRESS, payload: {ip}});
	}

	changePort(port: string) {
		this.dispatch({type: IpModule.ActionNames.CHANGE_PORT, payload: {port}});
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

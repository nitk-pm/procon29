import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as AppBarComponent from '../components/appbar';
import * as Actions from '../actions';

import * as AppBarModule from '../module/appbar';
import * as AppModule from '../module/app';
import * as GameModule from '../module/game';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		return this.dispatch({type: AppBarModule.ActionNames.CLOSE_WINDOW});
	}

	back() {
		return this.dispatch({type: AppModule.ActionNames.BACK});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({state: state.state}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppBarComponent.WindowAppBar);

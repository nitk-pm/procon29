import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as AppBarComponent from '../components/appbar';
import * as Actions from '../actions';

import * as AppBarModule from '../module/appbar';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		return this.dispatch(AppBarModule.close());
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppBarComponent.WindowAppBar);

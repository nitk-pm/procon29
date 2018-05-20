import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as AppBarComponent from '../components/appbar';
import * as Actions from '../actions';

import * as CloseModule from '../modules/close';
import * as DrawerModule from '../modules/drawer';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}
	
	close() {
		CloseModule.close();
	}

	toggleDrawer(state: boolean) {
		return this.dispatch(DrawerModule.toggleDrawer(state));
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppBarComponent.WindowAppBar);

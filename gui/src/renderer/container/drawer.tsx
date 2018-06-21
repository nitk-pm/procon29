import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as DrawerComponent from '../components/drawer';
import * as Store from '../store'
import * as Actions from '../actions';

import * as DrawerModule from '../module/drawer';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	toggleDrawer(open: boolean) {
		return this.dispatch(DrawerModule.toggleDrawer(open));
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({state: state.drawerOpen}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(DrawerComponent.WindowDrawer);

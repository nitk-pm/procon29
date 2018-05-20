import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as DrawerComponent from '../components/drawer';
import * as DrawerModule from '../modules/drawer';
import * as Store from '../store'

export class ActionDispatcher {
	constructor(private dispatch: (action: Store.Actions) => void) {}

	toggleDrawer(state: boolean) {
		return this.dispatch(DrawerModule.toggleDrawer(state));
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({state: state.drawerOpen}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(DrawerComponent.WindowDrawer);

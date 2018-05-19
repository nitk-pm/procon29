import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as AppBarComponent from '../components/appbar';

import * as CloseModule from '../modules/close';

export class ActionDispatcher {
	constructor(private dispatch: (action: Store.Actions) => void) {}
	
	close() {
		CloseModule.close();
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(AppBarComponent.WindowAppBar);

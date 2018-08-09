import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Common from '../../common';

import * as Store from '../store';
import * as Actions from '../actions';

import DrawerComponent from '../component/drawer';

import * as DrawerModule from '../module/drawer';
import * as AppModule from '../module/app';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		this.dispatch({
			type: DrawerModule.ActionNames.CLOSE_DRAWER
		});
	}

	openFile(e: any) {
		const reader = new FileReader();
		const path = e.target.files[0];
		reader.onload = (e) => {
			this.dispatch({
				type: AppModule.ActionNames.LOAD_BOARD,
				payload: {
					board: Common.loadBoard(JSON.parse(e.target.result))
				}
			});
			this.dispatch({
				type: AppModule.ActionNames.TRANSITION,
				payload: {
					state: Store.UIState.Edit
				}
			});
		};
		reader.readAsText(path);
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({open: state.drawerOpen}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(DrawerComponent);

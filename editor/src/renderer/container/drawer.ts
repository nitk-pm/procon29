import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Common from '../../common';

import * as Store from '../store';
import * as Actions from '../actions';

import DrawerComponent from '../component/drawer';

import * as DrawerModule from '../module/drawer';
import * as AppModule from '../module/app';

import * as SaveSaga from '../saga/save';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		this.dispatch({
			type: DrawerModule.ActionNames.CLOSE_DRAWER
		});
	}

	save() {
		this.dispatch({
			type: SaveSaga.ActionNames.SAVE
		});
	}
	
	new() {
		this.dispatch({
			type: AppModule.ActionNames.NEW_BOARD
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({open: state.drawerOpen}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(DrawerComponent);

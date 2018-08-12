import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Store from '../store';
import * as Actions from '../actions';
import * as Common from '../../common';

import AppComponent from '../component/app';

import * as AppModule from '../module/app';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	openFile(e: any) {
		const reader = new FileReader();
		const path = e.target.files[0];
		console.log('openfile ', e);
		reader.onload = (e) => {
			console.log('onload ', e);
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
	(state: Store.State) => ({state: state.state}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppComponent);

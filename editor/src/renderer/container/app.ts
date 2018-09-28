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
		reader.onload = (e :any) => {
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

	changeHeight(h: number) {
		this.dispatch({
			type: AppModule.ActionNames.CHANGE_HEIGHT,
			payload: { h }
		});
	}

	changeWidth(w: number) {
		this.dispatch({
			type: AppModule.ActionNames.CHANGE_WIDTH,
			payload: { w }
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		state: state.state,
		height: state.tbl.h,
		width: state.tbl.w
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppComponent);

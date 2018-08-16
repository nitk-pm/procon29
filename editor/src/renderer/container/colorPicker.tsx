import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Common from '../../common';

import * as Store from '../store';
import * as Actions from '../actions';

import ColorPickerComponent from '../component/colorPicker';

import * as AppModule from '../module/app';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		this.dispatch({
			type: AppModule.ActionNames.CLOSE_COLOR_PICKER
		});
	}

	changeColor(pos: Common.Pos, color: Common.Color) {
		this.dispatch({
			type: AppModule.ActionNames.CHANGE_COLOR,
			payload: {
				pos, color
			}
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.tbl, pos:state.editingColor}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(ColorPickerComponent);

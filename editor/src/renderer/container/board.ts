import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Store from '../store';
import * as Actions from '../actions';
import * as Common from '../../common';

import BoardComponent from '../component/board';
import * as BoardModule from '../module/board';
import * as AppModule from '../module/app';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	changeScore(pos: Common.Pos, score: number) {
		return this.dispatch({
			type: BoardModule.ActionNames.UPDATE_SCORE,
			payload: { pos, score }
		});
	}

	toggleColorPicker(pos: Common.Pos) {
		return this.dispatch({
			type: AppModule.ActionNames.TOGGLE_COLOR_PICKER,
			payload: { pos }
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.tbl}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent);

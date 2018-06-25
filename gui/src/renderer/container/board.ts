import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as Actions from '../actions';
import * as BoardComponent from '../components/board';
import * as GameModule from '../module/game';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Actions.T>;

	constructor (dispatch: Redux.Dispatch<Actions.T>) {
		this.dispatch = dispatch;
	}

	lclick(pos: Store.Pos) {
		return this.dispatch({
			type: GameModule.ActionNames.CLICK_SQUARE,
			payload: {
				pos,
				type: GameModule.ClickType.Left
			}
		});
	}

	rclick(pos: Store.Pos) {
		return this.dispatch({
			type: GameModule.ActionNames.CLICK_SQUARE,
			payload: {
				pos,
				type: GameModule.ClickType.Right
			}
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		table: state.board
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent.Board);

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as Board from '../components/board';
import * as Turn  from '../modules/turn';
import * as Logic from '../logic/igokabaddi';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Store.Actions>;

	constructor (dispatch: Redux.Dispatch<Store.Actions>) {
		this.dispatch = dispatch;
	}

	endTurn() {
		return this.dispatch(Turn.endTurn());
	}
}

export default ReactRedux.connect(
	(state: Store.IgokabaddiState) => ({board: state.board, turn: state.turn}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Board.Board);

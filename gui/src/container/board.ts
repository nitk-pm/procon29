import * as Redux from 'redux';
import * as Logic from '../logic/igokabaddi';
import * as Reducer from '../store';

import { connect } from 'react-redux';
import { Board } from '../components/board';
import { endTurn } from '../modules/endTurn';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Reducer.Actions>;

	constructor (dispatch: Redux.Dispatch<Reducer.Actions>) {
		this.dispatch = dispatch;
	}

	endTurn() {
		return this.dispatch(endTurn());
	}
}

export default connect(
	(state: Reducer.IgokabaddiState) => ({board: state.board, turn: state.turn}),
	(dispatch: Redux.Dispatch<Reducer.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Board);

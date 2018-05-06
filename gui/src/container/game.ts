import * as React from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';

import { Game } from '../components/game';
import { clickSquare } from '../modules/clickSquare';
import { endTurn } from '../modules/endTurn';
import * as Logic from '../logic/igokabaddi';
import * as Reducer from '../store';

export class ActionDispatcher {
	constructor(private dispatch: (action: Reducer.Actions) => void) {}

	public endTurn() {
		return this.dispatch(endTurn());
	}

	public clickSquare(pos: Logic.Pos) {
		return this.dispatch(clickSquare(pos));
	}
}

export default connect(
	(state: Reducer.IgokabaddiState) => ({board: state.board, turn: state.turn}),
	(dispatch: Redux.Dispatch<Reducer.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Game);

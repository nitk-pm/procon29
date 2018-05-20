import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';
import * as Actions from '../actions';

export interface StackHistoryAction extends Redux.Action {
	type: Actions.Names.STACK_HISTORY;
}

export function clickSquare(pos: Logic.Pos): StackHistoryAction {
	return {
		type: Actions.Names.STACK_HISTORY
	};
}

export function reducer(game: Store.GameState = Store.initialState.game, action: Actions.T) {
	switch(action.type) {
	case Actions.Names.STACK_HISTORY:
		let copy = game.hist.slice(0, game.hist.length);
		copy.push(game.board);
		return {
			...game,
			hist: copy
		};
	default:
		return game;
	}
}

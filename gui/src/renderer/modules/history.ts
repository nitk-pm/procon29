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

export function reducer(state: Store.State = Store.initialState, action: Actions.T) {
	switch(action.type) {
	case Actions.Names.STACK_HISTORY:
		const copy = state.hist.slice(0, state.hist.length);
		copy.push(state.board);
		return {
			...state,
			hist: copy
		};
	default:
		return state;
	}
}

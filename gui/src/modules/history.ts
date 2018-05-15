import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';


export interface StackHistoryAction extends Redux.Action {
	type: typeof Store.ActionNames.STACK_HISTORY;
}

export function clickSquare(pos: Logic.Pos): StackHistoryAction {
	return {
		type: Store.ActionNames.STACK_HISTORY
	};
}

export function reducer(state: Store.State = Store.initialState, action: Store.Actions) {
	switch(action.type) {
	case Store.ActionNames.STACK_HISTORY:
		const copy = state.hist.slice(0, state.hist.length);
		copy.push(state.table);
		return {
			...state,
			hist: copy
		};
	default:
		return state;
	}
}

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

export function reducer(board: Store.State = Store.initialState, action: Store.Actions) {
	switch(action.type) {
	default:
		return board;
	}
}

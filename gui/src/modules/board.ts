import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';


export interface ClickSquareAction extends Redux.Action {
	type: typeof Store.ActionNames.CLICK_SQUARE;
	payload: {
		pos : Logic.Pos;
	};
}

export function clickSquare(pos: Logic.Pos): ClickSquareAction {
	return {
		type: Store.ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

export function reducer(board: Store.BoardState = Store.initialState.table, action: Store.Actions) {
	switch(action.type) {
	default:
		return board;
	}
}

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

function isValid(x: number, y: number, tbl: Store.SquareState[][]) {
	return x >= 0 && x < tbl[0].length && y >= 0 && length;
}

export function reducer(board: Store.BoardState = Store.initialState.board, action: Store.Actions) {
	switch(action.type) {
	case Store.ActionNames.CLICK_SQUARE:
	default:
		return board;
	}
}

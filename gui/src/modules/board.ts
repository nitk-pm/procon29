import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

export function clickSquare(pos: Logic.Pos) {
	return {
		type: Store.ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

export function reducer(board: Logic.Board = Store.initialState.board, action: Store.Actions) {
	return board;
}

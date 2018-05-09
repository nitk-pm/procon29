import * as Redux from 'redux';
import { ActionNames, initialState, Actions } from '../store';
import { Pos, Board } from '../logic/igokabaddi';

export interface ClickSquareAction extends Redux.Action {
	type: ActionNames.CLICK_SQUARE;
	payload: {
		pos : Pos;
	};
}

export function clickSquare(pos: Pos) {
	return {
		type: ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

export function reducer(board: Board = initialState.board, action: Actions) {
	return board;
}

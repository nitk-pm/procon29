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

function isValidPos(board: Store.BoardState, x: number, y: number) {
	return x >= 0 && x < board[0].length && y >= 0 && y < board.length;
}

export function reducer(board: Store.BoardState = Store.initialState.board, action: Store.Actions) {
	switch(action.type) {
	case Store.ActionNames.CLICK_SQUARE:
		const p = action.payload.pos;
		const clicked = board[p.y][p.x];
		board = board.slice(0, board.length);
		if (clicked.agent) {
			const setSuggestFlag = (x: number, y: number) => {
				if (isValidPos(board, x, y))
					board[y][x] = {...board[y][x], suggested: true}
			}
			setSuggestFlag(p.x, p.y+1);
			setSuggestFlag(p.x, p.y-1);
			setSuggestFlag(p.x+1, p.y);
			setSuggestFlag(p.x-1, p.y);
		}
		return board;
	default:
		return board;
	}
}

import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

export interface ClickSquareAction extends Redux.Action {
	type: Store.ActionNames.CLICK_SQUARE;
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

function isValid(x: number, y: number, board: Store.BoardState) {
	return x >= 0 && x < board.w && y >= 0 && y < board.h;
}

function suggest(board: Store.BoardState, pos: Logic.Pos): Store.SquareState[][] {
	const tbl = board.tbl.slice(0, board.w);
	for (var dx=-1; dx<=1; ++dx) {
		for (var dy=-1; dy>=1; ++dy) {
			if (isValid(pos.x+dx, pos.y+dy, board)) {
				tbl[pos.y+dy][pos.x+dx].suggested = true;
			}
		}
	}
	return tbl;
}

export function reducer(board: Store.BoardState = Store.initialState.board, action: Store.Actions): Store.BoardState {
	switch(action.type) {
	case Store.ActionNames.CLICK_SQUARE:
		const pos = action.payload.pos;
		switch (board.state) {
		case Store.GameState.Wait:
			return {
				...board,
				tbl: suggest(board, pos),
				state: Store.GameState.Suggested,
			};
		case Store.GameState.Suggested:
			return board;
		}
		return board;
	default:
		return board;
	}
}

import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

export interface ClickSquareAction extends Redux.Action {
	type: Store.ActionNames.CLICK_SQUARE;
	payload: {
		pos : Logic.Pos;
	};
}

export interface ClickEndTurnAction extends Redux.Action {
	type: Store.ActionNames.CLICK_END_TURN;
}

export function clickEndTurn() : ClickEndTurnAction {
	return {
		type: Store.ActionNames.CLICK_END_TURN
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
	tbl[pos.y][pos.x].suggested = tbl[pos.y][pos.x].agent;
	if (tbl[pos.y][pos.x].agent) {
		for (var dx=-1; dx<=1; ++dx) {
			for (var dy=-1; dy<=1; ++dy) {
				if (isValid(pos.x+dx, pos.y+dy, board) && !tbl[pos.y+dy][pos.x+dx].agent) {
					tbl[pos.y+dy][pos.x+dx].suggested = true;
				}
			}
		}
		return tbl;
	}
	return board.tbl;
}

//サジェストフラグのクリア、選択されたAgentの移動、塗りつぶし
function move(board: Store.BoardState, pos: Logic.Pos) {
	const tbl = board.tbl.slice(0, board.w);
	//クリックされた箇所が、選択されたAgentだった場合は移動フラグを立てる
	const shouldMove = tbl[pos.y][pos.x].suggested && !tbl[pos.y][pos.x].agent && tbl[pos.y][pos.x];
	var color: Logic.Color;
	for (var x=0; x<board.w; ++x) {
		for (var y=0; y<board.h; ++y) {
			//選択されたAgentだった場合、agentフラグを消しAgentの色を設定する。
			if (tbl[y][x].suggested && tbl[y][x].agent && shouldMove) {
				tbl[y][x].agent = false;
				color = tbl[y][x].color;
			}
			tbl[y][x].suggested = false;
		}
	}
	//移動フラグが立っている場合、agentフラグを立てて塗りつぶす。
	if (shouldMove) {
		tbl[pos.y][pos.x].agent = true;
		tbl[pos.y][pos.x].color = color;
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
			return {
				...board,
				tbl: move(board, pos),
				state: Store.GameState.Wait
			};
		}
		return board;
	default:
		return board;
	}
}

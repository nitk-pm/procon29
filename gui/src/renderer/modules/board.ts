import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';
import * as Actions from '../actions';

export interface ClickSquareAction extends Redux.Action {
	type: Actions.Names.CLICK_SQUARE;
	payload: {
		pos : Logic.Pos;
	};
}

export interface ClickEndTurnAction extends Redux.Action {
	type: Actions.Names.CLICK_END_TURN;
}

export function clickEndTurn() : ClickEndTurnAction {
	return {
		type: Actions.Names.CLICK_END_TURN
	};
}

export function clickSquare(pos: Logic.Pos): ClickSquareAction {
	return {
		type: Actions.Names.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

function mapTbl(tbl_orig: Store.SquareState[][], f: ((square: Store.SquareState, x: number, y: number) => Store.SquareState)) {
	const tbl = tbl_orig.slice(0, tbl_orig.length);
	for (var y = 0; y < tbl.length; ++y) {
		for (var x = 0; x < tbl[y].length; ++x) {
			tbl[y][x] = f(tbl[y][x], x, y);
		}
	}
	return tbl;
}

function isValid(x: number, y: number, board: Store.BoardState) {
	return x >= 0 && x < board.w && y >= 0 && y < board.h;
}

//サジェストの作成
function suggest(board: Store.BoardState, pos: Logic.Pos):Store.BoardState {
	if (!board.tbl[pos.y][pos.x].agent || board.tbl[pos.y][pos.x].moved || board.tbl[pos.y][pos.x].color != board.turn) return board;
	const tbl = board.tbl.slice(0, board.w);
	tbl[pos.y][pos.x].suggested = true;
	for (var dx=-1; dx<=1; ++dx) {
		for (var dy=-1; dy<=1; ++dy) {
			if (isValid(pos.x+dx, pos.y+dy, board) && !tbl[pos.y+dy][pos.x+dx].agent) {
				tbl[pos.y+dy][pos.x+dx].suggested = true;
			}
		}
	}
	return {
		...board,
		tbl: tbl,
		state: Store.GameState.Suggested
	};
}

function clearSuggest(tbl: Store.SquareState[][]) {
	return mapTbl(tbl, (square, x, y) => ({...square, suggested: false}));
}

//サジェストフラグのクリア、選択されたAgentの移動、塗りつぶし
//クリック箇所がサジェストされた範囲ならそこにAgentを移動、範囲外ならサジェストのクリア
function move(board: Store.BoardState, pos: Logic.Pos) {
	if (board.tbl[pos.y][pos.x].agent || !board.tbl[pos.y][pos.x].suggested) return {...board, tbl: clearSuggest(board.tbl)};
	var to = pos;
	var from: Logic.Pos;
	var color = board.turn;
	var tbl = mapTbl(board.tbl, (square, x, y) => {
		if (square.suggested && square.agent) {
			from = new Logic.Pos(x, y);
			return {...square, agent: false, suggested: false};
		}
		else if (pos.eq(new Logic.Pos(x,y))) {
			return {...square, color: board.turn, agent: true, moved: true, suggested: false};
		}
		else {
			return {...square, suggested: false};
		}
	});
	return {
		...board, 
		tbl: tbl,
		state: Store.GameState.Wait
	};
}

export function reducer(board: Store.BoardState = Store.initialState.board, action: Actions.T): Store.BoardState {
	console.log(board);
	switch(action.type) {
	case Actions.Names.CLICK_SQUARE:
		const pos = action.payload.pos;
		switch (board.state) {
		case Store.GameState.Wait:
			return suggest(board, pos);
		case Store.GameState.Suggested:
			return move(board, pos);
		}
		return board;
	default:
		return board;
	}
}

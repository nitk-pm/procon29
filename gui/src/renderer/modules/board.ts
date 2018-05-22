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

function mapTbl(tbl_orig: Store.Table, f: ((square: Store.SquareState, x: number, y: number) => Store.SquareState)) {
	const tbl = tbl_orig.dup();
	for (var y = 0; y < tbl.h; ++y) {
		for (var x = 0; x < tbl.w; ++x) {
			const pos = new Logic.Pos(x,y);
			tbl.set(pos, f(tbl.get(pos), x, y));
		}
	}
	return tbl;
}

function isValid(x: number, y: number, tbl: Store.Table) {
	return x >= 0 && x < tbl.w && y >= 0 && y < tbl.h;
}

//サジェストの作成
function suggest(board: Store.BoardState, pos: Logic.Pos):Store.BoardState {
	if (!board.tbl.get(pos).agent || board.tbl.get(pos).moved || board.tbl.get(pos).color != board.turn) return board;
	const tbl = board.tbl.dup();
	tbl.get(pos).suggested = true;
	for (var dx=-1; dx<=1; ++dx) {
		for (var dy=-1; dy<=1; ++dy) {
			if (isValid(pos.x+dx, pos.y+dy, board.tbl) && !tbl.get(new Logic.Pos(pos.x+dx, pos.y+dy)).agent) {
				tbl.get(new Logic.Pos(pos.x+dx, pos.y+dy)).suggested = true;
			}
		}
	}
	return {
		...board,
		tbl: tbl,
		state: Store.ScreenState.Suggested
	};
}

function clearSuggest(tbl: Store.Table) {
	return mapTbl(tbl, (square, x, y) => ({...square, suggested: false}));
}

//サジェストフラグのクリア、選択されたAgentの移動、塗りつぶし
//クリック箇所がサジェストされた範囲ならそこにAgentを移動、範囲外ならサジェストのクリア
function move(board: Store.BoardState, pos: Logic.Pos) {
	if (board.tbl.get(pos).agent || !board.tbl.get(pos).suggested) return {...board, tbl: clearSuggest(board.tbl)};
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
		state: Store.ScreenState.Wait
	};
}

export function reducer(game: Store.GameState = Store.initialState.game, action: Actions.T): Store.GameState {
	switch(action.type) {
	case Actions.Names.CLICK_SQUARE:
		const pos = action.payload.pos;
		switch (game.board.state) {
		case Store.ScreenState.Wait:
			return {
				...game,
				board: suggest(game.board, pos)
			}
		case Store.ScreenState.Suggested:
			return {
				...game,
				board: move(game.board, pos)
			}
		}
		return game;
	case Actions.Names.CLICK_END_TURN:
		if (game.board.turn == Logic.Color.Red) {
			return {
				...game
			}
		}
		else {
			return {
				...game
			}
		}
	default:
		return game;
	}
}

import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	DONE = 'IGOKABADDI_DONE'
}

export enum ClickType {
	Right,
	Left
}
export type ClickSquareAction = {
	type: ActionNames.CLICK_SQUARE
	payload: {
		pos: Store.Pos;
		type: ClickType;
	}
}

export function clickSquare(pos: Store.Pos, type: ClickType): ClickSquareAction {
	return {
		type: ActionNames.CLICK_SQUARE,
		payload: {
			pos, type
		}
	};
}

export type DoneAction = {
	type: ActionNames.DONE;
}

export function done(): DoneAction {
	return {
		type: ActionNames.DONE,
	};
}

function washBoard(tbl: Store.Table) {
	// MovedまたはReadyの時はWaitに戻す
	let reset = (s: Store.Square) =>(
		s.state == Store.SquareState.Moved ||
		s.state == Store.SquareState.Ready ?
		{...s, state: Store.SquareState.Wait} : s);
	let newTbl =tbl.tbl.map(l =>l.map(reset));
	return new Store.Table(newTbl, tbl.h, tbl.w);
}

function reduceDone(state: Store.State) {
	let turn = state.turn;
	let nextTurn = turn == Store.Turn.Red ? Store.Turn.Blue : Store.Turn.Red;
	let nextController = state.turn == Store.Turn.Red ? state.config.blue : state.config.red;
	if (nextController == Store.Controller.Ai) throw "AI is not available";
	let tbl = washBoard(state.board);
	let log = state.log.slice();
	log.push(tbl);
	return {
		...state,
		turn: nextTurn,
		log,
		hist: new Array<Store.Table>(0),
		board: tbl
	};
}
/*
 * 手番切替時、cofigを参照して状態遷移
 * ターン終了時には盤面をlogに追加し、histをクリア
 * 操作を一度行う度にlogに盤面を保存
 */
export function reducer(state: Store.State = Store.initialState, action: Action.T) {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		return state;
	case ActionNames.DONE:
		return reduceDone(state);
	default:
		return state;
	}
}

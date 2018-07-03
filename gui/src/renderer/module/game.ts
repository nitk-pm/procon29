import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';
import { None, Option } from 'monapt';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	DONE = 'IGOKABADDI_DONE',
	CONFIG = 'IGOKABADDI_CONFIG',
	UPDATE_BOARD = 'IGOKABADDI_UPDATE_BOARD',
	CONNECT_ERROR = 'IGOKABADDI_CONNECT_ERROR'
}

export type ConfigAction = {
	type: ActionNames.CONFIG;
	payload: {
		config: Store.Config
	}
}

export type ConnectErrorAction = {
	type: ActionNames.CONNECT_ERROR;
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

export type UpdateBoardAction = {
	type: ActionNames.UPDATE_BOARD;
	payload: {
		board: Common.Table;
	};
}

export type DoneAction = {
	type: ActionNames.DONE;
}

function stackOperation(highlight: Option<Common.Pos>, pos: Common.Pos, clickType: ClickType) {
	let {x, y} = pos;
	return highlight.match({
		Some: p => {
			// クリック箇所がハイライト箇所の八方1マスにあるか
			if ((x <= p.x+1 && x >= p.x-1) && (y <= p.y+1 && y >= p.y-1) && !(p.x == x && p.y == y)) {
				let type = clickType == ClickType.Left ? Common.OperationType.Move : Common.OperationType.Clear;
				return Option({pos: p, to: pos, type});
			}
			else {
				return None;
			}
		},
		None: () => None 
	});
}

/*
 * 手番切替時、cofigを参照して状態遷移
 * ターン終了時には盤面をlogに追加し、histをクリア
 * 操作を一度行う度にlogに盤面を保存
 */
export function reducer(state: Store.State = Store.initialState, action: Action.T) {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		let {x, y} = action.payload.pos;
		let highlight = state.highlight.match({
			Some: p => None,
			None: () => state.board.arr[y][x].agent ? Option({x, y}) : None
		});
		let ops = stackOperation(state.highlight, action.payload.pos, action.payload.type).match({
				Some: op => state.ops.concat([op]),
				None: () => state.ops
			});
		return {
			...state,
			highlight,
			ops
		};
	case ActionNames.DONE:
		return state;
	case ActionNames.UPDATE_BOARD:
		return {
			...state,
			board: action.payload.board
		};
	case ActionNames.CONNECT_ERROR:
		return {
			...state,
			connectError: true
		};
	default:
		return state;
	}
}

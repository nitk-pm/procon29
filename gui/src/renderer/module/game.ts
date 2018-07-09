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
	CONNECT_ERROR = 'IGOKABADDI_CONNECT_ERROR',
	FREEZE = 'IGOKABADDI_FREEZE',
	THAWING = 'IGOKABADDI_THAWING'
}

export type ConfigAction = {
	type: ActionNames.CONFIG;
	payload: {
		config: Store.Config;
		color: Common.Color;
	}
}

export type ConnectErrorAction = {
	type: ActionNames.CONNECT_ERROR;
}

export type FreezeAction = {
	type: ActionNames.FREEZE;
}

export type ThawingAction = {
	type: ActionNames.THAWING;
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

// posをキーにopsからCommon.Operationを削除する
function removeOp(ops: Common.Operation[], pos: Common.Pos) {
	let newOps = new Array<Common.Operation>(0);
	for (var i=0; i < ops.length; ++i) {
		let p1 = pos;
		let p2 = ops[i].from;
		// 被っていたら古い方をスキップ
		if (p1.x == p2.x && p1.y == p2.y) continue;
		newOps.push(ops[i]);
	}
	return newOps;
}

// クリック箇所がvalidならoperationを積む
function tryStackOperation(from: Common.Pos, to: Common.Pos, clickType: ClickType, ops: Common.Operation[]) {
	// クリック箇所がハイライト箇所の八方1マスにあるか
	if ((to.x <= from.x+1 && to.x >= from.x-1) && (to.y <= from.y+1 && to.y >= from.y-1) && !(from.x == to.x && from.y == to.y)) {
		let type = clickType == ClickType.Left ? Common.OperationType.Move : Common.OperationType.Clear;
		let newOps = removeOp(ops, from);
		newOps.push({from, to, type});
		return newOps;
	}
	else {
		return ops;
	}
}

// クリック箇所がhighlight位置と同じなら
function tryReset(from: Common.Pos, to: Common.Pos, ops: Common.Operation[]) {
	if (from.x == to.x && from.y == to.y)
		return removeOp(ops, from);
	else
		return ops;
}

/*
 * 手番切替時、cofigを参照して状態遷移
 * ターン終了時には盤面をlogに追加し、histをクリア
 * 操作を一度行う度にlogに盤面を保存
 */
export function reducer(state: Store.State = Store.initialState, action: Action.T) {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		if (!state.freeze) {
			let {x, y} = action.payload.pos;
			let highlight = state.highlight.match({
				Some: p => None,
				None: () => state.board.arr[y][x].agent && state.board.arr[y][x].color == state.color ? Option({x, y}) : None
			});
			let ops = state.highlight.match({
				Some: p => {
						let ops = tryStackOperation(p, action.payload.pos, action.payload.type, state.ops);
						return tryReset(p, action.payload.pos, ops);
					},
				None: () => state.ops
			});
			return {
				...state,
				highlight,
				ops
			};
		}
		else {
			return state;
		}
	case ActionNames.CONFIG:
		console.log(action);
		return {
			...state,
			color: action.payload.color,
			config: action.payload.config
		};
	case ActionNames.FREEZE:
		return {
			...state,
			freeze: true
		};
	case ActionNames.THAWING:
		return {
			...state,
			freeze: false
		};
	case ActionNames.UPDATE_BOARD:
		return {
			...state,
			board: action.payload.board,
			ops: []
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

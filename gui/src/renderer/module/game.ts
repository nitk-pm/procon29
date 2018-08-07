import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';
import { None, Option } from 'monapt';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	DONE = 'IGOKABADDI_DONE',
	TRANSITION = 'IGOKABADDI_TRANSITION',
	UPDATE_BOARD = 'IGOKABADDI_UPDATE_BOARD',
	FREEZE = 'IGOKABADDI_FREEZE',
	THAWING = 'IGOKABADDI_THAWING',
	LOAD_BOARD = 'IGOKABADDI_LOAD_BOARD',
	BACK = 'IGOKABADDI_BACK'
}

export type ConfigAction = {
	type: ActionNames.TRANSITION;
	payload: {
		state: Store.UIState;
		color: Common.Color;
	}
}

export type LoadBoardAction = {
	type: ActionNames.LOAD_BOARD;
	payload: {
		board: Common.Table;
	}
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

export type BackAction = {
	type: ActionNames.BACK;
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

function isContiguoused(p1: Common.Pos, p2: Common.Pos) {
	if (p1.x <= p2.x+1 && p1.x >= p2.x-1 && p1.y <= p2.y+1 && p1.y >= p2.y-1) return true; 
	return false;
}

/*
 * 手番切替時、cofigを参照して状態遷移
 * ターン終了時には盤面をlogに追加し、histをクリア
 * 操作を一度行う度にlogに盤面を保存
 */
export function reducer(state: Store.State = Store.initialState, action: Action.T): Store.State {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		if (!state.freeze) {
			let {x, y} = action.payload.pos;
			let to = action.payload.pos;
			// ハイライトされた箇所がなければクリック箇所にエージェントが居るか確認してハイライト
			// 既にハイライト済みならハイライトの削除
			let highlight = state.highlight.match({
				Some: p => None,
				None: () => state.board.arr[y][x].agent && state.board.arr[y][x].color == state.color ? Option({x, y}) : None
			});
			let ops = state.highlight.match({
				Some: from => {
						let contigused = isContiguoused(from, to);
						let isClear = action.payload.type == ClickType.Right;
						let destColorIsEnemys =
							state.board.arr[y][x].color != Common.Color.Neut &&
							state.board.arr[y][x].color != state.color;
						if (contigused && (isClear || !destColorIsEnemys)) {
							let ops = removeOp(state.ops, from);
							if (to.x == from.x && to.y == from.y) {
								return ops;
							}
							if (isClear) {
								ops.push({from, to, type: Common.OperationType.Clear});
							}
							else {
								ops.push({from, to, type: Common.OperationType.Move});
							}
							return ops;
						}
						else {
							return state.ops;
						}
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
	case ActionNames.TRANSITION:
		return {
			...state,
			color: action.payload.color,
			state: action.payload.state
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
	case ActionNames.LOAD_BOARD:
		return {
			...state,
			state: Store.UIState.Viewer,
			board: action.payload.board
		};
	case ActionNames.BACK:
		return {
			...state,
			state: Store.UIState.Setting
		};
	default:
		return state;
	}
}

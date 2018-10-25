import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';
import { None, Option } from 'monapt';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE'
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

export function updateOps(from: Common.Pos, to: Common.Pos, type: ClickType, board: Common.Table, origOps: Common.Operation[], color: Common.Color) {
	let contigused = isContiguoused(from, to);
	let isClear = type == ClickType.Right;
	let destColorIsEnemys =
		board.arr[from.y][from.x].color != Common.Color.Neut &&
		board.arr[from.y][from.x].color != color;
	if (contigused && (isClear || !destColorIsEnemys) && board.arr[from.y][from.x].color == color) {
		let ops = removeOp(origOps, from);
		if (to.x == from.x && to.y == from.y) {
			return ops;
		}
		else if (isClear) {
			ops.push({from, to, type: Common.OperationType.Clear});
		}
		else {
			ops.push({from, to, type: Common.OperationType.Move});
		}
		return ops;
	}
	else {
		return origOps;
	}
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
				None: () => {
					return Option(to);
				}
			});

			// ハイライトされていた場合
			let ops, rivalOps = state.rivalOps;
			state.highlight.match({
				Some: from => {
					ops = updateOps(from, to, action.payload.type, state.board, state.ops, state.color)
					if (state.state == Store.UIState.Alone) {
						let rivalColor = state.color == Common.Color.Red ? Common.Color.Blue : Common.Color.Red;
						rivalOps = updateOps(from, to, action.payload.type, state.board, state.rivalOps, rivalColor)
					}
				},
				None: () => { ops = state.ops; }
			});
			return {
				...state,
				highlight,
				ops,
				rivalOps
			};
		}
		else {
			return state;
		}
	default:
		return state;
	}
}

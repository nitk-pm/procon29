import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

enum ActionNames {
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

export function clickSquare(pos: Store.Pos, type: ClickType): ClickSquareAction {
	return {
		type: ActionNames.CLICK_SQUARE,
		payload: {
			pos, type
		}
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
		console.log(action.payload);
		return state;
	default:
		return state;
	}
}

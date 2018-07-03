import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	DONE = 'IGOKABADDI_DONE',
	CONFIG = 'IGOKABADDI_CONFIG'
}

export type ConfigAction = {
	type: ActionNames.CONFIG;
	payload: {
		config: Store.Config
	}
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

export type DoneAction = {
	type: ActionNames.DONE;
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
		return state;
	default:
		return state;
	}
}

import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

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

import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';
import { None, Option } from 'monapt';

export enum ActionNames {
	TRANSITION = 'IGOKABADDI_TRANSITION',
	FREEZE = 'IGOKABADDI_FREEZE',
	THAWING = 'IGOKABADDI_THAWING',
	UPDATE_BOARD = 'IGOKABADDI_UPDATE_BOARD',
	BACK = 'IGOKABADDI_BACK',
	RECEIVE_OP = 'IGOKABADDI_RECEIVE_OP',
	CHANGE_DIR = 'IGOKABADDI_CHANGE_DIR',
	SWAP_SUIT = 'IGOKABADDI_SWAP_SUIT',
	UPDATE_TURN = 'IGOKABADDI_TURN'
}

export type UpdateTurnAction = {
	type: ActionNames.UPDATE_TURN;
	payload: {
		turn: number;
	}
}

export type SwapSuitAction = {
	type: ActionNames.SWAP_SUIT;
}

export type ChangeDirAction = {
	type: ActionNames.CHANGE_DIR;
	payload: {
		dir: string;
	}
}

export type ApplySettingAction = {
	type: ActionNames.TRANSITION;
	payload: {
		state: Store.UIState;
		color: Common.Color;
	}
}

export type UpdateBoardAction = {
	type: ActionNames.UPDATE_BOARD;
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

export type BackAction = {
	type: ActionNames.BACK;
}

export type ReceiveOpAction = {
	type: ActionNames.RECEIVE_OP;
	payload: {
		ops: Common.Operation[];
	};
};

export function reducer(state: Store.State = Store.initialState, action: Action.T): Store.State {
	switch (action.type) {
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
			rivalOps: [],
			ops: []
		};
	case ActionNames.BACK:
		return {
			...state,
			state: Store.UIState.Setting
		};
	case ActionNames.RECEIVE_OP:
		return {
			...state,
			rivalOps: action.payload.ops
		};
	case ActionNames.CHANGE_DIR:
		return {
			...state,
			dir: action.payload.dir
		};
	case ActionNames.SWAP_SUIT:
		return {
			...state,
			colorMap: [
				state.colorMap[1],
				state.colorMap[0]
			]
		};
	case ActionNames.UPDATE_TURN:
		return {
			...state,
			turn: action.payload.turn
		};
	default:
		return state;
	}
}

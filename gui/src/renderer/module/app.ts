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
	BACK = 'IGOKABADDI_BACK'
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

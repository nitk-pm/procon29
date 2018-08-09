import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

import { ipcRenderer } from 'electron';

export enum ActionNames {
	CLOSE_WINDOW = 'IGOKABADDI_CLOSE_WINDOW',
	TRANSITION = 'IGOKABADDI_TRANSITION',
	LOAD_BOARD = 'IGOKABADDI_LOAD'
}

export type CloseWindowAction = {
	type: ActionNames.CLOSE_WINDOW;
}

export type TransitionAction = {
	type: ActionNames.TRANSITION;
	payload: {
		state: Store.UIState;
	};
}

export type LoadBoardAction = {
	type: ActionNames.LOAD_BOARD;
	payload: {
		board: Common.Table;
	};
}

export function reducer(state: Store.State = Store.initialState, action: Actions.T) {
	switch (action.type) {
	// reducer内で副作用使ってはいけないとのことなのでsagaでやるべき?
	case ActionNames.CLOSE_WINDOW:
		ipcRenderer.send('message', 'exit');
		return state;
	case ActionNames.TRANSITION:
		return {
			...state,
			state: action.payload.state
		};
	case ActionNames.LOAD_BOARD:
		return {
			...state,
			tbl: action.payload.board
		};
	default:
		return state;
	}
}

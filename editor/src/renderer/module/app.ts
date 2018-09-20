import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

import { ipcRenderer } from 'electron';
import { Option, None } from 'monapt';

export enum ActionNames {
	CLOSE_WINDOW = 'IGOKABADDI_CLOSE_WINDOW',
	TRANSITION = 'IGOKABADDI_TRANSITION',
	LOAD_BOARD = 'IGOKABADDI_LOAD',
	TOGGLE_COLOR_PICKER = 'IGOKABADDI_TOGGLE_COLOR_PICKER',
	CLOSE_COLOR_PICKER = 'IGOKABADDI_CLOSE_COLOR_PICKER',
	CHANGE_COLOR = 'IGOKABADDI_CHANGE_COLOR',
	NEW_BOARD = 'IGOKABADDI_NEW_BOARD',
	CHANGE_HEIGHT = 'IGOKABADDI_CHANGE_HEIGHT',
	CHANGE_WIDTH = 'IGOKABADDI_CHANGE_WIDTH',
}

export type ChangeWidthAction = {
	type: ActionNames.CHANGE_WIDTH,
	payload: {
		w: number
	}
}

export type ChangeHeightAction = {
	type: ActionNames.CHANGE_HEIGHT,
	payload: {
		h: number
	}
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

export type ToggleColorPickerAction = {
	type: ActionNames.TOGGLE_COLOR_PICKER;
	payload: {
		pos: Common.Pos;
	};
};

export type CloseColorPickerAction = {
	type: ActionNames.CLOSE_COLOR_PICKER;
}

export type ChangeColorAction = {
	type: ActionNames.CHANGE_COLOR;
	payload: {
		pos: Common.Pos;
		color: Common.Color;
	};
}

export type NewBoardAction = {
	type: ActionNames.NEW_BOARD;
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
	case ActionNames.NEW_BOARD:
		return {
			...state,
			tbl: Common.newBoard(10, 8)
		};
   	case ActionNames.CHANGE_HEIGHT:
		if (action.payload.h > 12) return state;
	   	return {
			...state,
			tbl: Common.resizeBoard(state.tbl, state.tbl.w, action.payload.h)
	   	};
   	case ActionNames.CHANGE_WIDTH:
		if (action.payload.w > 12) return state;
		return {
			...state,
			tbl: Common.resizeBoard(state.tbl, action.payload.w, state.tbl.h)
		};
	case ActionNames.TOGGLE_COLOR_PICKER:
		return {
			...state,
			editingColor: Option(action.payload.pos)
		};
	case ActionNames.CLOSE_COLOR_PICKER:
		return {
			...state,
			editingColor: None
		};
	case ActionNames.CHANGE_COLOR:
		console.log(action.payload.color);
		let arr = state.tbl.arr.map(l => l.map(s => ({...s,})));
		let p = action.payload.pos;
		arr[p.y][p.x].color = action.payload.color;
		console.log(arr);
		return { ...state, tbl: {...state.tbl, arr }};
	default:
		return state;
	}
}

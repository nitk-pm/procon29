import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

import { ipcRenderer } from 'electron';

export enum ActionNames {
	CLOSE_WINDOW = 'IGOKABADDI_CLOSE_WINDOW'
}

export type CloseAction = {
	type: ActionNames.CLOSE_WINDOW;
}

export function reducer(state: Store.State = Store.initialState, action: Action.T) {
	switch (action.type) {
	case ActionNames.CLOSE_WINDOW:
		ipcRenderer.send('message', 'exit');
		console.log('send message');
		return state;
	default:
		return state;
	}
}

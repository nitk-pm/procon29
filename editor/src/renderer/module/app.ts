import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

import { ipcRenderer } from 'electron';

export enum ActionNames {
	CLOSE_WINDOW = 'IGOKABADDI_CLOSE_WINDOW'
}

export type CloseWindowAction = {
	type: ActionNames.CLOSE_WINDOW;
}

export function reducer(state: Store.State = Store.initialState, action: Actions.T) {
	switch (action.type) {
	// reducer内で副作用使ってはいけないとのことなのでsagaでやるべき?
	case ActionNames.CLOSE_WINDOW:
		ipcRenderer.send('message', 'exit');
		return state;
	default:
		return state;
	}
}

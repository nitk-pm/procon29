import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

export enum ActionNames {
	CLOSE_DRAWER = 'IGOKABADDI_CLOSE_DRAWER',
	OPEN_DRAWER = 'IGOKABADDI_OPEN_DRAWER'
}

export type CloseDrawerAction = {
	type: ActionNames.CLOSE_DRAWER;
}

export type OpenDrawerAction = {
	type: ActionNames.OPEN_DRAWER;
}

export function reducer(state: boolean = Store.initialState.drawerOpen, action: Actions.T) {
	switch (action.type) {
	case ActionNames.CLOSE_DRAWER:
		return false;
	case ActionNames.OPEN_DRAWER:
		return true;
	default:
		return state;
	}
}

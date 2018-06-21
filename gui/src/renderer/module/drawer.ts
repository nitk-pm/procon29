import * as Redux from 'redux';
import * as Action from '../actions';

enum ActionNames {
	TOGGLE_DRAWER = 'IGOKABADDI_TOGGLE_DRAWER'
}

export type ToggleDrawerAction = {
	type: ActionNames.TOGGLE_DRAWER;
	payload: {
		open: boolean;
	}
}

export function toggleDrawer(open: boolean): ToggleDrawerAction {
	return {
		type: ActionNames.TOGGLE_DRAWER,
		payload: { open }
	};
}

export function reducer(state: boolean = false, action: Action.T) {
	switch(action.type) {
	case ActionNames.TOGGLE_DRAWER:
		return action.payload.open;
	default:
		return state;
	}
}

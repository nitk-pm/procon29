import * as Redux from 'redux';
import * as Store from '../store';

export interface ToggleDrawerAction extends Redux.Action {
	type: Store.ActionNames.TOGGLE_DRAWER;
	payload: {
		open: boolean;
	};
}

export function toggleDrawer(state: boolean) : Store.Actions{
	return {
		type: Store.ActionNames.TOGGLE_DRAWER,
		payload: {
			open: state
		}
	};
}

export function reducer(open: boolean = Store.initialState.drawerOpen, action: Store.Actions) {
	switch(action.type) {
	case Store.ActionNames.TOGGLE_DRAWER:
		console.log(action.payload.open);
		return action.payload.open;
	default:
		return open;
	}
}

import * as Redux from 'redux';
import * as Store from '../store';
import * as Actions from '../actions';

export interface ToggleDrawerAction extends Redux.Action {
	type: Actions.Names.TOGGLE_DRAWER;
	payload: {
		open: boolean;
	};
}

export function toggleDrawer(state: boolean) : Actions.T{
	return {
		type: Actions.Names.TOGGLE_DRAWER,
		payload: {
			open: state
		}
	};
}

export function reducer(open: boolean = Store.initialState.drawerOpen, action: Actions.T) {
	switch(action.type) {
	case Actions.Names.TOGGLE_DRAWER:
		return action.payload.open;
	default:
		return open;
	}
}

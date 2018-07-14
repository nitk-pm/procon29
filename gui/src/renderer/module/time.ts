import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

export enum ActionNames {
	UPDATE_TIME = 'IGOKABADDI_UPDATE_TIMER'
}

export type UpdateTimeAction = {
	type: ActionNames.UPDATE_TIME;
	payload: {
		time: number;
	}
}

export function reducer(state: number, action: Action.T) {
	console.log(action);
	switch (action.type) {
	case ActionNames.UPDATE_TIME:
		return action.payload.time;
	}
	return state;
}

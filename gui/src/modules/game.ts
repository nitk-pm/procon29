import * as Redux from 'redux';
import * as Re from 'reduce-reducers';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';
import * as Board from '../modules/board';
import reduceReducers from 'reduce-reducers';

export function clickSquare(pos: Logic.Pos) {
	return {
		type: typeof Store.ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

function gameReducer(state: Store.State = Store.initialState, action: Store.Actions) {
	return state;
}

export const reducer = gameReducer;

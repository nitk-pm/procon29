import * as Redux from 'redux';
import * as Re from 'reduce-reducers';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';
import * as Board from '../modules/board';
import * as Turn from '../modules/turn';
import reduceReducers from 'reduce-reducers';

export interface ClickSquareAction extends Redux.Action {
	type: Store.ActionNames.CLICK_SQUARE;
	payload: {
		pos : Logic.Pos;
	};
}

export function clickSquare(pos: Logic.Pos) {
	return {
		type: Store.ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

function gameReducer(state: Store.IgokabaddiState = Store.initialState, action: Store.Actions) {
	return state;
}

export const reducer = reduceReducers(
	Redux.combineReducers({
		board: Board.reducer,
		turn: Turn.reducer
	}),
	gameReducer
);

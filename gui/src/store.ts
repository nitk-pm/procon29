import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import { ClickSquareAction } from './modules/clickSquare';
import { EndTurnAction } from './modules/endTurn';

export type Actions = ClickSquareAction | EndTurnAction | Action

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	END_TURN     = 'IGOKABADDI_END_TURN'
}

export type IgokabaddiState = {
	board: Logic.Board;
	turn: Logic.Turn;
}

export const initialState = {
	board: new Logic.Board(require('./initial_board.json')),
	turn: Logic.Turn.Red
}

export function reducer(state = initialState, action: Actions) {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		return state;
	case ActionNames.END_TURN:
		return state;
	default:
		return state;
	}
}

export default createStore(
	combineReducers({
		reducer
	})
)

export const store = createStore(reducer, initialState);

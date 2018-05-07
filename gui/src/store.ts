import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as ClickSquare from './modules/clickSquare';
import * as EndTurn from './modules/endTurn';
import * as BoardInit from './modules/boardInit';

export type Actions = ClickSquare.ClickSquareAction | EndTurn.EndTurnAction | Action

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

let reducer = combineReducers({
	turn: EndTurn.reducer,
	board: BoardInit.reducer
});



export const store = createStore(reducer, initialState);

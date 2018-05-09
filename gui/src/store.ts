import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as Board from './modules/board';
import * as Turn from './modules/turn';

export type Actions = Board.ClickSquareAction | Turn.EndTurnAction | Action

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

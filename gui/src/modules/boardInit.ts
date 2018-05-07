import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

export function reducer(board: Logic.Board = new Logic.Board(require('../initial_board.json')), action: Store.Actions) {
	switch (action.type) {
	default:
		return board;
	}
}

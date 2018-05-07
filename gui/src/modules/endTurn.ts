import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

export interface EndTurnAction extends Redux.Action {
	type: Store.ActionNames.END_TURN;
}

export function endTurn() {
	return {
		type: Store.ActionNames.END_TURN
	};
}

export function reducer(turn: Logic.Turn = Logic.Turn.Red, action: Store.Actions) {
	switch (action.type) {
	case Store.ActionNames.END_TURN:
		if (turn == Logic.Turn.Red) {
			return Logic.Turn.Blue;
		}
		else {
			return Logic.Turn.Red;
		}
	default:
		return turn;
	}
}

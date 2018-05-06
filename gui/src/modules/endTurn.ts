import * as Redux from 'redux';
import { ActionNames } from '../store';

export interface EndTurnAction extends Redux.Action {
	type: ActionNames.END_TURN;
}

export function endTurn() {
	return {
		type: ActionNames.END_TURN
	};
}

import * as Redux from 'redux';
import { ActionNames } from '../store';
import { Pos } from '../logic/igokabaddi';

export interface ClickSquareAction extends Redux.Action {
	type: ActionNames.CLICK_SQUARE;
	payload: {
		pos : Pos;
	};
}

export function clickSquare(pos: Pos) {
	return {
		type: ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE'
}

export enum ClickType {
	Right,
	Left
}
export type ClickSquareAction = {
	type: ActionNames.CLICK_SQUARE
	payload: {
		pos: Store.Pos;
		type: ClickType;
	}
}

export function clickSquare(pos: Store.Pos, type: ClickType): ClickSquareAction {
	return {
		type: ActionNames.CLICK_SQUARE,
		payload: {
			pos, type
		}
	};
}

export function reducer(state: Store.State = Store.initialState, action: Action.T) {
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		console.log(action.payload);
		return state;
	default:
		return state;
	}
}

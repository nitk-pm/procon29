import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as Common from '../../common';
import { None, Option } from 'monapt';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	CHANGE_COLOR = 'IGOKABADDI_CANGE_COLOR',
	TOGGLE_AGENT = 'IGOKABADDI_TOGGLE_AGENT',
	UNSET_HIGHLIGHT = 'IGOKABADDI_UNSET_HIGHLIGHT'
}

export type UnsetHighLightAction = {
	type: ActionNames.UNSET_HIGHLIGHT;
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

export function reducer(state: Store.State = Store.initialState, action: Action.T): Store.State {
	let boardCopy = Common.deepCopy(state.board);
	switch (action.type) {
	case ActionNames.CLICK_SQUARE:
		let to = action.payload.pos;
		return state.highlight.match({
			Some: from => {
				let tbl = Common.deepCopy(state.board);
				if (state.board.arr[to.y][to.x].agent < 0) {
					tbl.arr[to.y][to.x] = state.board.arr[from.y][from.x];
					tbl.arr[from.y][from.x].color = Common.Color.Neut;
					tbl.arr[from.y][from.x].agent = -1;
					return {
						...state,
						board: tbl,
						highlight: None
					};
				}
				else {
					return {
						...state,
						highlight: None
					};
				}
			},
			None: () => {
				if (state.board.arr[to.y][to.x].agent >= 0) {
					return {
						...state,
						highlight: Option(to)
					};
				}
				return state;
			}
		});
	case ActionNames.UNSET_HIGHLIGHT:
		return {
			...state,
			highlight: None
		};
	default:
		return state;
	}
}

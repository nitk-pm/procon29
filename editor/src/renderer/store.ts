import * as Common from '../common';
import { Option, None } from 'monapt';

export enum UIState {
	Load,
	Edit
}

export type State = {
	state: UIState;
	tbl: Common.Table;
	drawerOpen: boolean;
	editingColor: Option<Common.Pos>;
};

export const initialState: State = { tbl: Common.newBoard(12, 12), state: UIState.Load, drawerOpen: true, editingColor: None }

export const getBoard = (state: State) => state.tbl;
